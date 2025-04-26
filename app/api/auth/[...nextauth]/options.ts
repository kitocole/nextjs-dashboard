/* app/api/auth/[...nextauth]/options.ts */
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { CustomAdapter } from './customAdapter';

export const authOptions: NextAuthOptions = {
  adapter: CustomAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[demo login] creds:', credentials);
        const user = await db.user.findUnique({
          where: { email: credentials!.email },
        });
        console.log('[demo login] user from DB:', user);
        if (!user?.passwordHash) {
          console.log('[demo login] missing hash; rejecting');
          return null;
        }
        const valid = await bcrypt.compare(credentials!.password, user.passwordHash);
        console.log('[demo login] password match?', valid);
        return valid ? user : null;
      },
    }),
  ],
  pages: { signIn: '/login' },
};
