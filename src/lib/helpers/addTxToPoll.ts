import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Sends TX ID to the backend to add to the poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param txId - The ID of the transaction to add to the poll
 * @returns { pollTransactionId: string, message: string } - Valid ID if successful, -1 otherwise with a message
 */
export async function addTxToPoll(
  pollId: string,
  txId: string,
): Promise<{ pollTransactionId: string; message: string }> {
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
      return {
        pollTransactionId: data.pollTransactionId,
        message: 'TX ID saved',
      };
    } else {
      return { pollTransactionId: '-1', message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { pollTransactionId: '-1', message: error.response.data.message };
    } else {
      return {
        pollTransactionId: '-1',
        message: 'An error occurred saving the TX ID',
      };
    }
  }
}
