import { connectWallet as connectWalletClarity } from '@claritydao/clarity-backend';
import { Typography } from '@mui/material';
import * as Sentry from '@sentry/nextjs';
import { bech32 } from 'bech32';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

/**
 * Connects the user's wallet to the application. It first connects the webapp to the wallet
 * via the CIP-30 wallet connection. The connectWallet function from clarity-backend simply
 * calls the .enable() function on the wallet provider. Once the wallet is connected, it retrieves
 * the user's stake address and signs them in using the next-auth signIn function.
 * @param walletName - Name of the wallet to connect (ex: eternl, nami, etc)
 * @returns boolean - True if the wallet was successfully signed-in, false otherwise
 */
export async function connectWallet(walletName: string): Promise<boolean> {
  try {
    const wallet = await connectWalletClarity(walletName);
    // @ts-expect-error getRewardAddresses is actually a proper function
    const stakeAddressHex = (await wallet.getRewardAddresses())[0];
    const bytes = Buffer.from(stakeAddressHex, 'hex');
    const words = bech32.toWords(bytes);

    // @ts-expect-error getNetworkId exists
    const network = await wallet.getNetworkId();
    if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet' && network !== 1) {
      toast.error('Please switch to Mainnet and try again.');
      return false;
    } else if (process.env.NEXT_PUBLIC_NETWORK === 'testnet' && network !== 0) {
      toast.error('Please switch to Preview Network and try again.');
      return false;
    }

    let stakeAddress;
    if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet') {
      stakeAddress = bech32.encode('stake', words);
    } else {
      stakeAddress = bech32.encode('stake_test', words);
    }

    // Sign in is defined here pages/api/auth/[...nextauth].ts
    const signInResponse = await signIn('credentials', {
      redirect: false,
      stakeAddress: stakeAddress,
      walletName: walletName,
    });
    if (!signInResponse || signInResponse.status !== 200) {
      toast.error(
        <Typography
          sx={{
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '300px',
          }}
        >
          {`Only Representatives need to connect their wallet. ${stakeAddress} is not registered. `}
        </Typography>,
      );
      return false;
    } else {
      return true;
    }
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}
