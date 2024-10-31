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
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.stakeAddress === 'string')
        session.user.stakeAddress = token.stakeAddress;
      if (typeof token.walletName === 'string')
        session.user.walletName = token.walletName;
      const user = await prisma.user.findFirst({
        where: {
          wallet_address: session.user.stakeAddress,
        },
      });
      if (user) {
        session.user.id = user.id.toString();
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
        // Optionally, you could log or handle this case (e.g., by displaying a message)
        console.log(
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
