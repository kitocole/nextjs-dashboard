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

      // ← Add this:
      profile(profile) {
        // profile is the raw Google OIDC response
        console.log('🔍 Google profile:', profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
          emailVerified: profile.email_verified,
        };
      },
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
        const user = await db.user.findUnique({ where: { email: credentials!.email } });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials!.password, user.passwordHash);
        return valid ? user : null;
      },
    }),
  ],
  pages: { signIn: '/login' },
};
