import { isTransactionConfirmed } from '@claritydao/clarity-backend';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';

import { buildClarityBackendReq } from '@/lib/buildClarityBackendReq';

/**
 * Monitors a transaction until it is confirmed
 * @param txId - The transaction ID to monitor
 * @returns Boolean - True if the transaction is confirmed, false otherwise
 */
export async function awaitTxConfirm(txId: string): Promise<boolean> {
  try {
    const clarityBackendReq = await buildClarityBackendReq();
    if (!clarityBackendReq) {
      toast.error('Error monitoring transaction.');
      return false;
    }
    return new Promise((resolve) => {
      // timeout is just hardcoded to 300 seconds (5 minutes)
      let elapsedTime = 0;
      const intervalId = setInterval(async () => {
        elapsedTime += 5000; // Increment elapsed time by 5 seconds (5000 ms)
        // If the elapsed time exceeds or equals the max time, clear the interval and exit
        if (elapsedTime >= 300000) {
          // Clear the interval once the transaction is confirmed
          clearInterval(intervalId);
          resolve(false);
        }

        const isConfirmed = await isTransactionConfirmed(
          clarityBackendReq.url,
          txId,
        );

        if (isConfirmed) {
          // Clear the interval once the transaction is confirmed
          clearInterval(intervalId);
          resolve(true);
        }
      }, 5000); // Run every 5 seconds
    });
  } catch (error) {
    Sentry.captureException(error);
    toast.error('Error monitoring transaction.');
    return false;
  }
}
