// app/api/auth/[...nextauth]/customAdapter.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/prisma';

export function CustomAdapter() {
  const adapter = PrismaAdapter(db);

  return {
    ...adapter,
    // Override only createUser:
    async createUser(data: {
      id: string; //unique id for google
      emailVerified: boolean;
      email: string;
      image: string;
      firstName: string;
      lastName: string;
    }) {
      return db.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: null,
          suffix: null,
          email: data.email!,
          image: data.image,
          emailVerified: data.emailVerified,
          role: 'User',
          passwordHash: '', // or null if nullable
        },
      });
    },
  };
}
