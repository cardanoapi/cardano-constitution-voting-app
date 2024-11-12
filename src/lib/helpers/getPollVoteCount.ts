import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Gets all votes for a poll
 * @param stakeAddress - The user's stake address
 * @returns Votes - The number of votes for the poll
 * @returns Message - An error message if the vote count fetch failed
 */
export async function getPollVoteCount(
  pollId: string,
): Promise<{ votes: number; message: string }> {
  try {
    if (pollId) {
      const response = await axios.get(`/api/getPollVoteCount/${pollId}`, {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      });
      const data = await response.data;
      if (response.status === 200) {
        return { votes: data.count, message: 'Vote count found' };
      } else {
        return { votes: -1, message: data.message };
      }
    } else {
      return { votes: -1, message: 'Error getting vote count' };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { votes: -1, message: error.response.data.message };
    } else {
      return { votes: -1, message: 'Error getting vote count' };
    }
  }
}
