import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { signMessage } from '@/lib/signMessage';

/**
 * Casts a vote on a poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param vote - The vote to cast
 * @param stakeAddress - The stake address of the user casting the vote
 * @param walletName - The name of the wallet to sign the vote with
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully started, false otherwise with a message
 */
export async function castVote(
  pollId: string,
  vote: string,
  stakeAddress: string | null | undefined,
  walletName: string | null | undefined,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    if (!stakeAddress || !walletName) {
      return {
        succeeded: false,
        message: 'You must be signed in as a Representative to vote.',
      };
    }
    const timestamp = new Date().toLocaleString();
    const message = `Wallet: ${stakeAddress}, Poll Id: ${pollId}, Vote: ${vote}, Timestamp: ${timestamp}`;
    const signature = await signMessage(walletName, message);
    const response = await axios.post(
      '/api/newPollVote',
      {
        pollId: pollId,
        vote: vote,
        signature: signature,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'Vote cast' };
    } else {
      return { succeeded: false, message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, message: error.response.data.message };
    } else {
      return { succeeded: false, message: 'An error occurred casting vote' };
    }
  }
}
