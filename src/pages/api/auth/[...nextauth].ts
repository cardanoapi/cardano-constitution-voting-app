/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

// the shape of the user session object is defined in /types/next-auth.d.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      type: 'credentials',
      credentials: {
        stakeAddress: { label: 'Stake Address', type: 'text' },
        walletName: { label: 'Wallet Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: {
            wallet_address: credentials.stakeAddress,
          },
        });

        if (user) {
          return {
            id: user.id.toString(),
            stakeAddress: credentials.stakeAddress,
            walletName: credentials.walletName,
            isCoordinator: user.is_convention_organizer,
            isDelegate: user.is_delegate,
            isAlternate: user.is_alternate,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.stakeAddress = user.stakeAddress;
        token.walletName = user.walletName;
        token.isCoordinator = user.isCoordinator;
        token.isDelegate = user.isDelegate;
        token.isAlternate = user.isAlternate;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.walletName === 'string')
        session.user.walletName = token.walletName;
      if (typeof token.isCoordinator === 'boolean')
        session.user.isCoordinator = token.isCoordinator;
      if (typeof token.isDelegate === 'boolean')
        session.user.isDelegate = token.isDelegate;
      if (typeof token.isAlternate === 'boolean')
        session.user.isAlternate = token.isAlternate;
      if (typeof token.stakeAddress === 'string') {
        session.user.stakeAddress = token.stakeAddress;
        const user = await prisma.user.findFirst({
          where: {
            wallet_address: token.stakeAddress,
          },
        });
        if (user) {
          session.user.id = user.id.toString();
        }
      }

      return Promise.resolve(session);
    },
    async signIn({ credentials }) {
      // https://next-auth.js.org/configuration/callbacks#sign-in-callback
      if (!credentials) return false;

      // Check if the user is registered in the database
      const registeredUser = await prisma.user.findFirst({
        where: {
          wallet_address: credentials.stakeAddress.value,
        },
      });

      // If user exists in the database, allow sign-in; otherwise, deny it
      if (registeredUser) {
        return true;
      } else {
        console.error(
          `Sign-in attempt with unregistered wallet address: ${credentials.stakeAddress}`,
        );
        return false;
      }
    },
  },
};

// // https://next-auth.js.org/configuration/initialization#advanced-initialization
export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<typeof NextAuth> {
  // https://next-auth.js.org/getting-started/client#additional-parameters
  return NextAuth(req, res, authOptions);
}
