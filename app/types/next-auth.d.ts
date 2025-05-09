// next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id?: string;
      email?: string | null;
      firstName?: string;
      role: string;
      lastName?: string;
      middleName?: string | null;
      suffix?: string | null;
    };
  }
  interface User extends DefaultUser {
    id: string;
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
    id?: string;
    firstName?: string;
    middleName?: string | null;
    lastName?: string;
    suffix?: string | null;
    email?: string | null;
    role?: string;
  }
}
