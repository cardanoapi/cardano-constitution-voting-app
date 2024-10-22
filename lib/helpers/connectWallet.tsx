import { connectWallet as connectWalletClarity } from '@claritydao/clarity-backend';
import { bech32 } from 'bech32';

export default async function connectWallet(walletName: string): Promise<void> {
  await connectWalletClarity(walletName).then(async (wallet) => {
    const stakeAddressHex = (await wallet.getRewardAddresses())[0];
    const bytes = Buffer.from(stakeAddressHex, 'hex');
    const words = bech32.toWords(bytes);
    const stakeAddress = bech32.encode('stake', words);
    console.log('stake address connected', stakeAddress);
  });
}
