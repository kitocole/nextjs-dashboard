// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const db = new PrismaClient();

// Known suffixes to randomly assign
const SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'MD', 'PhD', 'Esq.'];
function randomSuffix(): string | null {
  return faker.helpers.arrayElement([...SUFFIXES, null, null, null, null, null, null]);
}

async function main() {
  // 1) Upsert demo users
  const demos = [
    { firstName: 'Admin', lastName: 'Admin', email: 'admin@example.com', password: 'changeme' },
    { firstName: 'User', lastName: 'User', email: 'editor@example.com', password: 'changeme' },
  ];

  for (const u of demos) {
    const hash = await bcrypt.hash(u.password, 10);
    await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        firstName: u.firstName,
        middleName: null,
        lastName: u.lastName,
        suffix: null,
        email: u.email,
        role: 'User',
        passwordHash: hash,
      },
    });
    console.log(`Seeded demo user: ${u.email}`);
  }

  // 2) Clear non-demo users
  await db.user.deleteMany({ where: { email: { notIn: demos.map((d) => d.email) } } });
  console.log('Cleared non-demo users.');

  // 3) Generate 100 random users
  console.log('🎲 Generating 100 random users...');
  const users: Array<{
    firstName: string;
    middleName: string | null;
    lastName: string;
    suffix: string | null;
    email: string;
    role: string;
    passwordHash: string;
  }> = [];
  const emailSet = new Set<string>();

  while (users.length < 100) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    if (emailSet.has(email)) continue;
    const pass = 'BadPass'; // faker.internet.password({ length: 8 });
    const hashed = await bcrypt.hash(pass, 10);
    emailSet.add(email);
    users.push({
      firstName,
      middleName: faker.datatype.boolean() ? faker.person.middleName() : null,
      lastName,
      suffix: randomSuffix(),
      email,
      role: faker.helpers.arrayElement(['User']),
      passwordHash: hashed,
    });
  }

  await db.user.createMany({ data: users });
  console.log(`✅ Seeded ${users.length} random users.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
