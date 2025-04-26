// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const db = new PrismaClient();

// Known suffixes to randomly assign
const SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'MD', 'PhD', 'Esq.'];

/** Generate a random suffix or null */
function randomSuffix(): string | null {
  return faker.helpers.arrayElement([...SUFFIXES, null]);
}

async function main() {
  console.log('🧹 Clearing existing users...');
  await db.user.deleteMany();

  const totalUsers = 100;
  console.log(`🎲 Generating ${totalUsers} unique users with realistic emails...`);

  const users: Array<{
    firstName: string;
    middleName: string | null;
    lastName: string;
    suffix: string | null;
    email: string;
    role: string;
  }> = [];
  const emailSet = new Set<string>();

  while (users.length < totalUsers) {
    const firstName = faker.person.firstName();
    const middleName = faker.datatype.boolean() ? faker.person.middleName() : null;
    const lastName = faker.person.lastName();
    const suffix = randomSuffix();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    // Ensure unique emails
    if (emailSet.has(email)) continue;
    emailSet.add(email);

    const role = faker.helpers.arrayElement(['Admin', 'Editor', 'Viewer']);

    users.push({ firstName, middleName, lastName, suffix, email, role });
  }

  console.log('🚀 Inserting users into database...');
  await db.user.createMany({
    data: users,
    skipDuplicates: false,
  });

  console.log(`✅ Seeded ${users.length} users with realistic emails and name parts.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
