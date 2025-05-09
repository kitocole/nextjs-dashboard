// app/lib/route.ts
import type { NextAuthOptions } from 'next-auth';

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
          role: 'User', // Default role or fetch dynamically if needed
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
          role: 'User', // Default role or fetch dynamically if needed
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
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          suffix: user.suffix,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('User:', user);
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.middleName = user.middleName;
        token.lastName = user.lastName;
        token.suffix = user.suffix;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.middleName = token.middleName;
        session.user.lastName = token.lastName;
        session.user.suffix = token.suffix;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};
