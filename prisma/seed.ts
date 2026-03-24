import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@kmtls.co.kr' },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists, skipping...');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('admin', 12);

  // Create admin organization and user in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create organization
    const organization = await tx.organization.create({
      data: {
        name: 'KMTLS Heavy Lifting Co.',
        slug: 'kmtls-hq',
        plan: 'ENTERPRISE',
        businessNumber: '123-45-67890',
        address: '서울특별시 강남구 테헤란로 123',
        phoneNumber: '02-1234-5678',
      },
    });

    console.log('✅ Created organization:', organization.name);

    // Create custom positions
    const positions = await Promise.all([
      tx.customPosition.create({
        data: {
          name: '대표이사',
          level: 1,
          organizationId: organization.id,
        },
      }),
      tx.customPosition.create({
        data: {
          name: '현장 반장',
          level: 2,
          organizationId: organization.id,
        },
      }),
      tx.customPosition.create({
        data: {
          name: '크레인 운전사',
          level: 3,
          organizationId: organization.id,
        },
      }),
      tx.customPosition.create({
        data: {
          name: '안전 관리자',
          level: 2,
          organizationId: organization.id,
        },
      }),
    ]);

    console.log('✅ Created custom positions:', positions.length);

    // Create admin user
    const adminUser = await tx.user.create({
      data: {
        email: 'admin@kmtls.co.kr',
        name: '김관리자',
        hashedPassword,
        role: 'SUPER_ADMIN',
        organizationId: organization.id,
        emailVerified: new Date(),
        phoneNumber: '010-1234-5678',
        address: '서울특별시 강남구 역삼동',
        addressDetail: '123번지 ABC빌딩 5층',
        postalCode: '06234',
        department: '경영지원팀',
        position: 'CTO',
        customPositionId: positions[0].id, // 대표이사
        hireDate: new Date('2020-01-01'),
        employeeNumber: 'EMP-001',
        emergencyContactName: '김비상',
        emergencyContactPhone: '010-9876-5432',
        emergencyContactRelation: '배우자',
        lastLoginAt: new Date(),
      },
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create additional test users
    const testUsers = await Promise.all([
      tx.user.create({
        data: {
          email: 'manager@kmtls.co.kr',
          name: '박매니저',
          hashedPassword: await bcrypt.hash('manager123', 12),
          role: 'MANAGER',
          organizationId: organization.id,
          phoneNumber: '010-2345-6789',
          department: '현장운영팀',
          customPositionId: positions[1].id, // 현장 반장
          hireDate: new Date('2021-03-15'),
          employeeNumber: 'EMP-002',
        },
      }),
      tx.user.create({
        data: {
          email: 'operator@kmtls.co.kr',
          name: '이운전사',
          hashedPassword: await bcrypt.hash('operator123', 12),
          role: 'MEMBER',
          organizationId: organization.id,
          phoneNumber: '010-3456-7890',
          department: '장비운영팀',
          customPositionId: positions[2].id, // 크레인 운전사
          hireDate: new Date('2022-06-01'),
          employeeNumber: 'EMP-003',
        },
      }),
      tx.user.create({
        data: {
          email: 'safety@kmtls.co.kr',
          name: '최안전',
          hashedPassword: await bcrypt.hash('safety123', 12),
          role: 'MANAGER',
          organizationId: organization.id,
          phoneNumber: '010-4567-8901',
          department: '안전관리팀',
          customPositionId: positions[3].id, // 안전 관리자
          hireDate: new Date('2021-09-01'),
          employeeNumber: 'EMP-004',
        },
      }),
    ]);

    console.log('✅ Created test users:', testUsers.length);

    return { organization, adminUser, testUsers, positions };
  });

  console.log('\n✨ Seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ Admin Account (SUPER_ADMIN)                             │');
  console.log('│ Email:    admin@kmtls.co.kr                             │');
  console.log('│ Password: admin                                          │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ Manager Account (MANAGER)                               │');
  console.log('│ Email:    manager@kmtls.co.kr                           │');
  console.log('│ Password: manager123                                     │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ Operator Account (MEMBER)                               │');
  console.log('│ Email:    operator@kmtls.co.kr                          │');
  console.log('│ Password: operator123                                    │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ Safety Manager Account (MANAGER)                        │');
  console.log('│ Email:    safety@kmtls.co.kr                            │');
  console.log('│ Password: safety123                                      │');
  console.log('└─────────────────────────────────────────────────────────┘');
  console.log(`\n🏢 Organization: ${result.organization.name}`);
  console.log(`📊 Custom Positions: ${result.positions.length}`);
  console.log(`👥 Total Users: ${result.testUsers.length + 1}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
