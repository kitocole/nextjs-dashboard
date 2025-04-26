// app/api/auth/[...nextauth]/customAdapter.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/prisma';

export function CustomAdapter() {
  const adapter = PrismaAdapter(db);

  return {
    ...adapter,
    // Override only createUser:
    async createUser(data: { emailVerified: Date; name: string; email: string; image: string }) {
      const [firstName = '', ...rest] = (data.name || '').split(' ');
      const lastName = rest.join(' ') || firstName;

      return db.user.create({
        data: {
          firstName,
          lastName,
          middleName: null,
          suffix: null,
          email: data.email!,
          image: data.image,
          emailVerified: data.emailVerified,
          role: 'User',
          passwordHash: '', // or null if nullable
          name: data.name,
        },
      });
    },
  };
}
