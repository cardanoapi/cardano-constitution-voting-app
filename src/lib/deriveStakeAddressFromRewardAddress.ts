import type { Wallet } from '@claritydao/clarity-backend';
import { bech32 } from 'bech32';

/**
 * Derives the bech32 and hex stake address from the reward address
 * retrieved from the wallet API.
 * @param wallet - Wallet object from clarity-backend
 * @returns { stakeAddress: string, stakeAddressHex: string } - The bech32 and hex stake address
 */
export async function deriveStakeAddressFromRewardAddress(
  wallet: Wallet,
): Promise<{
  stakeAddress: string;
  stakeAddressHex: string;
}> {
  // @ts-expect-error getRewardAddresses is actually a proper function
  const stakeAddressHex = (await wallet.getRewardAddresses())[0];
  const bytes = Buffer.from(stakeAddressHex, 'hex');
  const words = bech32.toWords(bytes);

  let stakeAddress;
  if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet') {
    stakeAddress = bech32.encode('stake', words);
  } else {
    stakeAddress = bech32.encode('stake_test', words);
  }

  return { stakeAddress: stakeAddress, stakeAddressHex: stakeAddressHex };
}
