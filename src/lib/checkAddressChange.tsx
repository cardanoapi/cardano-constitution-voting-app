import type { Wallet } from '@claritydao/clarity-backend';
import * as Sentry from '@sentry/nextjs';

import { deriveStakeAddressFromRewardAddress } from '@/lib/deriveStakeAddressFromRewardAddress';

/**
 * This function checks if the user has changed their wallet since connecting
 * @param wallet - Wallet object from clarity-backend
 * @param currentStakeAddress - Current stake address of the user from the session
 * @returns boolean - True if the user has changed their wallet, false otherwise
 */
export async function checkAddressChange(
  wallet: Wallet,
  currentStakeAddress: string,
): Promise<boolean> {
  try {
    const { stakeAddress } = await deriveStakeAddressFromRewardAddress(wallet);

    if (currentStakeAddress !== stakeAddress) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    Sentry.captureException(error);
    return true;
  }
}
