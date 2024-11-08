import axios from 'axios';

import { signMessage } from '../signMessage';

/**
 * Casts a vote on a poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param vote - The vote to cast
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
    const message = `Wallet: ${stakeAddress}, Poll Id: ${pollId}, Vote: ${vote}`;
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
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, message: error.response.data.message };
    } else {
      return { succeeded: false, message: 'An error occurred casting vote' };
    }
  }
}
