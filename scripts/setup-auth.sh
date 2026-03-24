#!/bin/bash

# KMTLS Next-Gen Authentication Setup Script
# This script generates secure random keys for authentication

set -e

echo "🔐 KMTLS Next-Gen Authentication Setup"
echo "======================================="
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
  echo "⚠️  .env.local already exists."
  read -p "Do you want to overwrite it? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
  fi
  mv .env.local .env.local.backup
  echo "✅ Backed up existing .env.local to .env.local.backup"
fi

# Generate ENCRYPTION_KEY (32 bytes = 64 hex characters)
echo "🔑 Generating encryption key..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Generate HASH_SALT
echo "🔑 Generating hash salt..."
HASH_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Generate NEXTAUTH_SECRET (32 bytes)
echo "🔑 Generating NextAuth secret..."
NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env.local file
cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextgen_db"

# Encryption (Generated: $(date))
ENCRYPTION_KEY=$ENCRYPTION_KEY
HASH_SALT=$HASH_SALT

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Kakao OAuth (Get from https://developers.kakao.com)
# KAKAO_CLIENT_ID=your-kakao-client-id
# KAKAO_CLIENT_SECRET=your-kakao-client-secret
EOF

echo ""
echo "✅ .env.local created successfully!"
echo ""
echo "📝 Next Steps:"
echo "  1. Update DATABASE_URL with your PostgreSQL connection string"
echo "  2. Get Kakao OAuth credentials from https://developers.kakao.com"
echo "  3. Uncomment and fill in KAKAO_CLIENT_ID and KAKAO_CLIENT_SECRET"
echo "  4. Run: npx prisma migrate dev"
echo ""
echo "⚠️  IMPORTANT:"
echo "  - Never commit .env.local to git"
echo "  - Backup these keys securely"
echo "  - Use different keys for production"
echo ""
echo "🔐 Generated Keys Summary:"
echo "  ENCRYPTION_KEY: ${ENCRYPTION_KEY:0:10}... (64 chars)"
echo "  HASH_SALT: ${HASH_SALT:0:10}... (64 chars)"
echo "  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}... (64 chars)"
echo ""
