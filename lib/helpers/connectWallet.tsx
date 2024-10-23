import { connectWallet as connectWalletClarity } from '@claritydao/clarity-backend';
import { bech32 } from 'bech32';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default async function connectWallet(walletName: string): Promise<void> {
  try {
    await connectWalletClarity(walletName).then(async (wallet) => {
      // @ts-expect-error getRewardAddresses is actually a proper function
      const stakeAddressHex = (await wallet.getRewardAddresses())[0];
      const bytes = Buffer.from(stakeAddressHex, 'hex');
      const words = bech32.toWords(bytes);
      const stakeAddress = bech32.encode('stake', words);

      // Sign in is defined here pages/api/auth/[...nextauth].ts
      const signInResponse = await signIn('credentials', {
        redirect: false,
        stakeAddress: stakeAddress,
        walletName: walletName,
      });
      if (!signInResponse || signInResponse.status !== 200) {
        toast.error('Failed to authenticate user');
        return;
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
