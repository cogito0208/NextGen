# Authentication System Documentation

## Overview

KMTLS Next-Gen uses NextAuth.js v5 (Auth.js) for a comprehensive authentication system with the following features:

- **Email/Password Authentication**: Traditional credentials-based login
- **Kakao OAuth**: Social login integration
- **Extended User Profiles**: Personal information, job details, emergency contacts
- **Encrypted Resident ID Storage**: AES-256-CBC encryption for sensitive data
- **Custom Position System**: Organization-specific job titles and hierarchy
- **Role-Based Access Control**: SUPER_ADMIN, ADMIN, MANAGER, MEMBER roles

## Architecture

### Tech Stack

- **NextAuth.js v5**: Authentication framework
- **Prisma 6**: ORM and database client
- **PostgreSQL**: Database
- **bcryptjs**: Password hashing (12 rounds)
- **Node.js crypto**: AES-256-CBC encryption
- **Zod**: Schema validation

### Database Schema

#### Core Models

1. **User** - Extended with:
   - Personal info (phone, address, postal code)
   - Encrypted resident ID (encryptedResidentId, residentIdIv, residentIdHash)
   - Job info (department, position, customPositionId, hireDate, employeeNumber)
   - Emergency contact (name, phone, relation)
   - Metadata (lastLoginAt)

2. **Organization** - Extended with:
   - businessNumber
   - address, phoneNumber
   - customPositions relation

3. **CustomPosition** - New model:
   - name (e.g., "현장 반장", "크레인 운전사")
   - level (hierarchy, 1 = highest)
   - organizationId

4. **NextAuth Models**:
   - Account (OAuth accounts)
   - Session (user sessions)
   - VerificationToken (email verification)

### File Structure

```
src/
├── auth.ts                              # NextAuth.js configuration
├── proxy.ts                             # Middleware for route protection
├── types/
│   └── next-auth.d.ts                  # TypeScript type extensions
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   └── encryption.ts                    # AES-256 encryption utilities
├── services/
│   └── user-profile.service.ts         # Profile management logic
├── components/
│   └── auth/
│       ├── LoginForm.tsx               # Login UI component
│       └── RegisterForm.tsx            # Registration UI component
└── app/
    ├── api/
    │   ├── auth/
    │   │   ├── [...nextauth]/route.ts  # NextAuth API handler
    │   │   └── register/route.ts       # Registration endpoint
    │   ├── user/
    │   │   └── profile/route.ts        # Profile CRUD
    │   └── organization/
    │       └── positions/route.ts      # Custom positions
    └── (auth)/
        ├── login/page.tsx              # Login page
        └── register/page.tsx           # Registration page
```

## Security Features

### Encryption

**Resident ID Encryption (AES-256-CBC)**:
- Each record has a unique random IV (Initialization Vector)
- 32-byte encryption key stored in environment variable
- Encrypted data + IV stored separately
- Hash for duplicate detection without decryption

**Password Security**:
- bcrypt hashing with 12 salt rounds
- Minimum 8 characters enforced
- Never logged or transmitted in plain text

### Access Control

**Role Hierarchy**:
1. SUPER_ADMIN - System-wide access
2. ADMIN - Organization-wide access, can create positions
3. MANAGER - Department-level access
4. MEMBER - Individual access

**Resident ID Access Rules**:
- Users can access their own data
- ADMIN/SUPER_ADMIN can access within same organization
- Cross-organization access denied
- All access should be logged (TODO: implement audit trail)

### Middleware Protection

**Public Routes**: `/`, `/login`, `/register`
**Protected Routes**: `/dashboard`, `/settings`, `/users`, `/api/*` (except `/api/auth/*`)

**Redirect Logic**:
- Authenticated users → redirected from `/login` to `/dashboard`
- Unauthenticated users → redirected to `/login?callbackUrl=...`

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user@localhost:5432/nextgen_db"

# Encryption Keys (generate with setup script)
ENCRYPTION_KEY=64-hex-character-key
HASH_SALT=random-salt-string
NEXTAUTH_SECRET=32-byte-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000

# Kakao OAuth
KAKAO_CLIENT_ID=your-client-id
KAKAO_CLIENT_SECRET=your-client-secret
```

### Key Generation

Run the setup script:
```bash
./scripts/setup-auth.sh
```

Or generate manually:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Endpoints

### Authentication

**POST /api/auth/register**
- Creates new organization + user
- First user becomes ADMIN
- Validates email uniqueness
- Hashes password with bcrypt

Request:
```json
{
  "organizationName": "KMTLS Heavy Lifting",
  "name": "John Doe",
  "email": "john@kmtls.com",
  "password": "securepass123"
}
```

**POST /api/auth/callback/credentials**
- Handles email/password login
- Updates lastLoginAt
- Returns JWT token

**GET /api/auth/callback/kakao**
- OAuth callback for Kakao
- Creates organization if needed
- Auto-assigns ADMIN role

### User Profile

**GET /api/user/profile**
- Returns current user's profile
- Excludes encrypted fields
- Includes organization and custom position

**PATCH /api/user/profile**
- Updates profile fields
- Handles residentId encryption automatically
- Validates input with Zod

Request:
```json
{
  "phoneNumber": "010-1234-5678",
  "address": "서울시 강남구",
  "residentId": "900101-1234567",
  "department": "Operations",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "010-9876-5432"
}
```

### Custom Positions

**GET /api/organization/positions**
- Returns all positions for user's organization
- Includes user count per position
- Sorted by hierarchy level

**POST /api/organization/positions** (ADMIN only)
- Creates new custom position
- Validates name uniqueness within org
- Requires level (integer)

Request:
```json
{
  "name": "현장 반장",
  "level": 3
}
```

## User Flows

### Registration Flow

1. User fills RegisterForm (organization, name, email, password)
2. Client validates password match and length
3. POST /api/auth/register
4. Server validates with Zod
5. Checks email uniqueness
6. Hashes password (bcrypt, 12 rounds)
7. Transaction: Creates Organization + User (role: ADMIN)
8. Redirects to /login?registered=true

### Login Flow

1. User fills LoginForm (email, password)
2. Calls signIn('credentials', { email, password })
3. NextAuth calls CredentialsProvider.authorize()
4. Validates credentials with bcrypt.compare()
5. Updates lastLoginAt
6. Creates JWT with user.id, role, organizationId
7. Sets secure httpOnly cookie
8. Redirects to /dashboard

### Kakao OAuth Flow

1. User clicks "Login with Kakao"
2. Calls signIn('kakao')
3. Redirects to Kakao OAuth page
4. User authorizes
5. Callback to /api/auth/callback/kakao
6. NextAuth creates/updates User
7. If no organization, creates one
8. Assigns ADMIN role
9. Creates JWT
10. Redirects to /dashboard

### Profile Update Flow

1. User edits profile form
2. PATCH /api/user/profile
3. Validates with Zod
4. If residentId provided:
   - Validates format (YYMMDD-XXXXXXX)
   - Checks for duplicates via hash
   - Encrypts with AES-256-CBC
   - Generates random IV
   - Stores encrypted + IV + hash
5. Updates other fields directly
6. Returns updated profile

## Best Practices

### Security

1. **Never log sensitive data**
   ```typescript
   // ❌ BAD
   console.log('Password:', password);
   console.log('Resident ID:', residentId);

   // ✅ GOOD
   console.log('Login attempt for user:', email);
   console.log('Profile updated for user:', userId);
   ```

2. **Always validate input**
   ```typescript
   const schema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
   });
   const result = schema.safeParse(body);
   ```

3. **Use transactions for related operations**
   ```typescript
   await prisma.$transaction(async (tx) => {
     const org = await tx.organization.create(...);
     const user = await tx.user.create(...);
   });
   ```

4. **Encrypt before storing**
   ```typescript
   const { encrypted, iv } = encrypt(residentId);
   await prisma.user.update({
     where: { id },
     data: { encryptedResidentId: encrypted, residentIdIv: iv },
   });
   ```

### Error Handling

1. **Generic client errors**
   ```typescript
   // ❌ BAD
   return NextResponse.json({ error: 'User with email john@example.com not found' });

   // ✅ GOOD
   return NextResponse.json({ error: 'Invalid credentials' });
   ```

2. **Detailed server logs**
   ```typescript
   catch (error) {
     console.error('Registration error:', error); // Detailed
     return NextResponse.json({ error: 'An error occurred' }); // Generic
   }
   ```

### Performance

1. **Use Prisma select**
   ```typescript
   // ❌ BAD - fetches all fields
   const user = await prisma.user.findUnique({ where: { id } });

   // ✅ GOOD - only needed fields
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, email: true, name: true },
   });
   ```

2. **Index frequently queried fields**
   ```prisma
   @@index([organizationId])
   @@index([customPositionId])
   ```

## Testing

### Manual Testing Checklist

- [ ] Register new account
- [ ] Email uniqueness validation
- [ ] Password hashing works
- [ ] Login with email/password
- [ ] Login with Kakao OAuth
- [ ] Session persists across page reloads
- [ ] Logout clears session
- [ ] Update profile (name, phone, address)
- [ ] Add resident ID (encrypted)
- [ ] View profile (resident ID not exposed)
- [ ] ADMIN can create custom positions
- [ ] MEMBER cannot create positions
- [ ] Middleware redirects work
- [ ] Protected routes blocked for unauthenticated

### Database Verification

```sql
-- Check encrypted resident ID (should be unreadable)
SELECT encrypted_resident_id, resident_id_iv FROM users WHERE id = 'user-id';

-- Verify password hashing (should start with $2a$ or $2b$)
SELECT hashed_password FROM users WHERE email = 'test@example.com';

-- Check organization isolation
SELECT COUNT(*) FROM custom_positions WHERE organization_id = 'org-id';
```

## Troubleshooting

### Common Issues

**1. "ENCRYPTION_KEY must be 64 hexadecimal characters"**
- Run `./scripts/setup-auth.sh` to generate proper keys
- Verify .env.local has correct ENCRYPTION_KEY

**2. "Unauthorized" on protected routes**
- Check if session cookie is set (inspect browser DevTools)
- Verify NEXTAUTH_URL matches current URL
- Check middleware config matcher

**3. "Database connection failed"**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env.local
- Ensure database exists: `createdb nextgen_db`

**4. Kakao OAuth fails**
- Verify KAKAO_CLIENT_ID and KAKAO_CLIENT_SECRET
- Check Redirect URI in Kakao Developers console
- Must match: `http://localhost:3000/api/auth/callback/kakao`

**5. Migration fails**
- Ensure DATABASE_URL is set
- Use Prisma 6 (not 7): `npm install prisma@^6.0.0`
- Run with env var: `DATABASE_URL=... npx prisma migrate dev`

## Next Steps

### Planned Features (Phase 2)

- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] Audit logging for sensitive data access
- [ ] Rate limiting on API endpoints
- [ ] Session management UI (view/revoke sessions)
- [ ] OAuth providers: Google, Naver
- [ ] Profile picture upload
- [ ] Account deletion workflow

### Production Deployment

1. **Environment Setup**
   - Use AWS KMS or similar for ENCRYPTION_KEY
   - Set NEXTAUTH_URL to production domain
   - Enable HTTPS only
   - Use managed PostgreSQL (RDS, etc.)

2. **Security Hardening**
   - Set secure cookies: `sameSite: 'strict'`
   - Add CSP headers
   - Enable Helmet.js
   - Implement rate limiting
   - Set up monitoring (Sentry, DataDog)

3. **Performance**
   - Enable Prisma connection pooling
   - Add Redis for session storage
   - Set up CDN for static assets
   - Optimize database indexes

## References

- [NextAuth.js v5 Docs](https://authjs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Kakao OAuth Guide](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)

---

**Last Updated**: 2026-03-24
**Version**: 1.0
**Maintainer**: KMTLS Development Team
