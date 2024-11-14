import {
  payToSelfWithMetdata,
  type TransactionSubmitResult,
} from '@claritydao/clarity-backend';
import * as Sentry from '@sentry/nextjs';

import { buildClarityBackendReq } from '@/lib/buildClarityBackendReq';

/**
 * Post poll votes on chain.
 * Note that the top-level key of the metadata object must be a number. The number corresponds to the registry
 * located at https://github.com/cardano-foundation/CIPs/blob/master/CIP-0010/registry.json. I just picked 27 as
 * it seems to be available.
 * @param metadata - The metadata for the transaction
 * @returns A promise that resolves to the transaction hash if the transaction is successful, or false if the transaction fails
 */
export async function postVotesOnChain(
  metadata: {
    [key: string]: string[];
  }[],
): Promise<TransactionSubmitResult | false> {
  try {
    const clarityBackendReq = await buildClarityBackendReq();
    if (!clarityBackendReq) {
      return false;
    }
    const txHash = await payToSelfWithMetdata(
      clarityBackendReq.url,
      clarityBackendReq.wallet,
      {
        user: clarityBackendReq.user,
        metadata: {
          27: metadata,
        },
      },
    );
    return txHash;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}
