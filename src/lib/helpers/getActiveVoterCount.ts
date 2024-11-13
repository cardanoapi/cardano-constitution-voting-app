import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Gets the number of active voters to help determine the winner
 * @returns Voters - The number of active voters, -1 if error
 * @returns Message - An error message if the vote count fetch failed
 */
export async function getActiveVoterCount(): Promise<{
  voters: number;
  message: string;
}> {
  try {
    const response = await axios.get(`/api/getActiveVoterCount`, {
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    const data = await response.data;
    if (response.status === 200) {
      return { voters: data, message: 'Voter count found' };
    } else {
      return { voters: -1, message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { voters: -1, message: error.response.data.message };
    } else {
      return { voters: -1, message: 'Error getting voter count' };
    }
  }
}
