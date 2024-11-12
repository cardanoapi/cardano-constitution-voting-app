import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Generates a challenge to be sent with the user's signature
 * @returns Challenge if successful, false otherwise
 */
export async function getChallenge(): Promise<{
  succeeded: boolean;
  challenge: string | null;
}> {
  try {
    const response = await axios.post(
      '/api/newChallenge',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, challenge: data.challenge };
    } else {
      return { succeeded: false, challenge: null };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, challenge: null };
    } else {
      return {
        succeeded: false,
        challenge: null,
      };
    }
  }
}
