import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Sends summary TX ID to the backend to add to the poll table
 * @param pollId - The ID of the poll to cast a vote on
 * @param txId - The ID of the transaction to add to the poll
 * @returns { success: boolean, message: string } - Valid ID if successful, -1 otherwise with a message
 */
export async function addTxToPoll(
  pollId: string,
  txId: string,
): Promise<{ success: boolean; message: string }> {
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
        success: true,
        message: 'TX ID saved',
      };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message };
    } else {
      return {
        success: false,
        message: 'An error occurred saving the TX ID',
      };
    }
  }
}
