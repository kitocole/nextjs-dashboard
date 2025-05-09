// app/lib/customAdapter.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/prisma';
import { Role } from '@prisma/client'; // Import the Role enum

export function CustomAdapter() {
  const adapter = PrismaAdapter(db);

  return {
    ...adapter,
    // Override only createUser:
    // Note: emailVerified comes in as `boolean | null` from your profile() mappers
    async createUser(data: {
      email: string;
      emailVerified: boolean | null;
      image: string;
      firstName: string;
      lastName: string;
      role: string;
    }) {
      return db.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: null,
          suffix: null,
          email: data.email,
          image: data.image,
          // convert boolean → Date or leave null
          emailVerified: data.emailVerified ? new Date() : null,
          role: (data.role as Role) || Role.USER, // Cast to Role enum
          passwordHash: '', // leave blank for OAuth users
        },
      });
    },
  };
}
