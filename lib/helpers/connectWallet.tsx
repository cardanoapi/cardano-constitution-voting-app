import { connectWallet as connectWalletClarity } from '@claritydao/clarity-backend';
import { bech32 } from 'bech32';
import { signIn, SignInResponse } from 'next-auth/react';
import toast from 'react-hot-toast';

export default async function connectWallet(walletName: string): Promise<void> {
  try {
    await connectWalletClarity(walletName).then(async (wallet) => {
      const stakeAddressHex = (await (wallet as any).getRewardAddresses())[0];
      const bytes = Buffer.from(stakeAddressHex, 'hex');
      const words = bech32.toWords(bytes);
      const stakeAddress = bech32.encode('stake', words);
      console.log('stake address connected', stakeAddress);
      // @ts-expect-error getNetworkId is actually a proper function
      // const signature = await wallet.signData(stakeAddrHex, messageHex);
      // const challenge = await generateCardanoChallenge();

      // Sign in is defined here pages/api/auth/[...nextauth].ts
      const signInResponse = await signIn('credentials', {
        redirect: false,
        stakeAddress: stakeAddress,
        // payload: message,
        // signature: signature.signature,
        // key: signature.key,
        walletName: walletName,
        // challenge: challenge,
      });
      if (!signInResponse || signInResponse.status !== 200) {
        toast.error('Failed to authenticate user');
        return;
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
