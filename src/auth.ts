import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import KakaoProvider from 'next-auth/providers/kakao';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { organization: true },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          return null;
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure user has an organization
      if (account?.provider === 'kakao' && user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { organization: true },
        });

        // If OAuth user doesn't have an organization, create one
        if (existingUser && !existingUser.organizationId) {
          const orgName = user.name
            ? `${user.name}'s Organization`
            : 'My Organization';
          const slug = `org-${Date.now()}`;

          const organization = await prisma.organization.create({
            data: {
              name: orgName,
              slug,
              plan: 'FREE',
            },
          });

          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              organizationId: organization.id,
              role: 'ADMIN',
            },
          });
        }

        // Update last login
        if (existingUser) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLoginAt: new Date() },
          });
        }
      }

      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
