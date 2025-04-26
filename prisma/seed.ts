// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const db = new PrismaClient();

// Known suffixes to randomly assign
const SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'MD', 'PhD', 'Esq.'];

function randomSuffix() {
  return faker.helpers.arrayElement([...SUFFIXES, '']);
}

async function main() {
  // Clear existing data (optional for dev)
  await db.user.deleteMany();

  // Generate 100 users
  const users = Array.from({ length: 100 }).map(() => {
    const firstName = faker.person.firstName();
    const middleName = faker.datatype.boolean() ? faker.person.middleName() : null;
    const lastName = faker.person.lastName();
    const suffix = randomSuffix() || null;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const role = faker.helpers.arrayElement(['Admin', 'Editor', 'Viewer']);

    return {
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      role,
    };
  });

  // Bulk insert users
  await db.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log('✅ Seeded', users.length, 'users with name parts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
