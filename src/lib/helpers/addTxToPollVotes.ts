import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Sends TX ID to the backend to add to a user's poll vote
 * @param userIds - Array of the user IDs to add the TX to
 * @param pollId - The ID of the poll the user voted in
 * @param pollTransactionId - The ID of the poll transaction
 * @returns { succeeded: boolean, message: string } - True if the TX was successfully added, false otherwise with a message
 */
export async function addTxToPollVotes(
  userIds: string[],
  pollId: string,
  pollTransactionId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/addTxToPollVotes',
      {
        userIds: userIds,
        pollId: pollId,
        pollTransactionId: pollTransactionId,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'TX ID saved to user votes' };
    } else {
      return { succeeded: false, message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, message: error.response.data.message };
    } else {
      return {
        succeeded: false,
        message: 'An error occurred saving the TX ID to user votes',
      };
    }
  }
}
