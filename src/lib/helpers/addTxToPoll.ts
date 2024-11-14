import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Sends TX ID to the backend to add to the poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param txId - The ID of the transaction to add to the poll
 * @returns { succeeded: boolean, message: string } - True if the TX was successfully added, false otherwise with a message
 */
export async function addTxToPoll(
  pollId: string,
  txId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/addTxToPoll',
      {
        pollId: pollId,
        txId: txId,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'TX ID saved' };
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
        message: 'An error occurred saving the TX ID',
      };
    }
  }
}
