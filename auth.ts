import NextAuth from 'next-auth';
import { UserRole } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
	signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('signIn', user, account);
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id);
      if (!existingUser) return false;

      return true;
    },
    async session({ token, session }) {
      console.log('session', session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.username = token.username as string;
      }

      console.log('session-out', session);
      return session;
    },
    async jwt({ token }) {
      console.log('jwt', token);
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return null;

      token.username = existingUser.username;
      token.role = existingUser.role;

      console.log('jwt-out', token);
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 60,
  },
  ...authConfig,
});
