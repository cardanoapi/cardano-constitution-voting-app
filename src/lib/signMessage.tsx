import { connectWallet as connectWalletClarity } from '@claritydao/clarity-backend';
import toast from 'react-hot-toast';

import { getChallenge } from './helpers/getChallenge';

export async function signMessage(
  walletName: string,
  message: string,
): Promise<
  | {
      signature: {
        signedMessage: {
          signature: string;
          key: string;
        };
        payload: string;
      };
      challenge: {
        succeeded: boolean;
        challenge: string | null;
      };
    }
  | false
> {
  const wallet = await connectWalletClarity(walletName);
  // @ts-expect-error getRewardAddresses is actually a proper function
  const stakeAddressHex = (await wallet.getRewardAddresses())[0];

  const challenge = await getChallenge();

  const messageHex = Buffer.from(message).toString('hex');
  // @ts-expect-error signData is actually a proper function
  const signature = await wallet.signData(stakeAddressHex, messageHex);
  if (!signature.signature) {
    toast.error(
      'Failed to sign message. Please refresh the app and try again.',
    );
    return false;
  } else {
    return {
      signature: { signedMessage: signature, payload: message },
      challenge: challenge,
    };
  }
}
