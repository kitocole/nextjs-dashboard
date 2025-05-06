// next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & { role: string };
  }
  interface User extends DefaultUser {
    role: string;
    firstName: string;
    lastName: string;
    emailVerified: Date | null;
    middleName: string | null;
    suffix: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: string;
  }
}
