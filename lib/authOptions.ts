// app/lib/route.ts
import type { NextAuthOptions } from 'next-auth';
import type { User as PrismaUser } from '@prisma/client';

import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/prisma';
import { CustomAdapter } from './customAdapter';

export const authOptions: NextAuthOptions = {
  adapter: CustomAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
          emailVerified: profile.email_verified,
          role: 'user', // Default role or fetch dynamically if needed
          middleName: '', // Default or fetch dynamically
          suffix: '', // Default or fetch dynamically
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email ?? undefined,
          image: profile.avatar_url,
          firstName: profile.name ?? '',
          lastName: profile.login,
          emailVerified: null,
          role: 'user', // Default role or fetch dynamically if needed
          middleName: '', // Default or fetch dynamically
          suffix: '', // Default or fetch dynamically
        };
      },
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        return isValid ? (user as PrismaUser) : null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add user role to the token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role; // Add role to the session
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};
