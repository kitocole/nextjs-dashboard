// app/api/auth/[...nextauth]/customAdapter.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/prisma';
import { Role } from '@prisma/client';

function isValidRole(role: string): role is Role {
  return (Object.values(Role) as string[]).includes(role);
}

export function CustomAdapter() {
  const adapter = PrismaAdapter(db);

  return {
    ...adapter,

    async createUser(data: {
      email: string;
      emailVerified: boolean | null;
      image: string;
      firstName: string;
      lastName: string;
      role: string;
    }) {
      const safeRole: Role = isValidRole(data.role) ? data.role : Role.USER;

      return db.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: null,
          suffix: null,
          email: data.email,
          image: data.image,
          emailVerified: data.emailVerified ? new Date() : null,
          role: safeRole,
          passwordHash: '',
        },
      });
    },
  };
}
