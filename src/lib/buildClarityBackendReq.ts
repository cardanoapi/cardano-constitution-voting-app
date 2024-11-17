import {
  connectWallet,
  createUserWallet,
  type User,
  type Wallet,
} from '@claritydao/clarity-backend';
import { getSession } from 'next-auth/react';

/**
 * Returns the Clarity Backend User object for server-side TXs
 * This object is used for most server-side transactions
 * @returns Clarity Backend Request Objects
 */
export async function buildClarityBackendReq(): Promise<{
  url: string;
  wallet: Wallet;
  user: User;
} | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const walletName = session.user.walletName;
  const url =
    process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
      ? 'https://tx.clarity-mainnet-new.staging.mlabs.city'
      : 'https://tx.clarity.staging.mlabs.city'; // NOTE: Preview network is not supported for this function
  const wallet = await connectWallet(walletName);
  const user = await createUserWallet(wallet);

  return { url, wallet, user };
}
