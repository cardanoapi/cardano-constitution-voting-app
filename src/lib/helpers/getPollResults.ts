import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Gets the results of a poll
 * @param pollId - The ID of the poll to get results for
 * @returns Votes - An object with an array of votes & corresponding voter names & ids
 * @returns Message - An error message if the vote count fetch failed
 */
export async function getPollResults(pollId: string): Promise<{
  votes: {
    yes: {
      name: string;
      id: string;
    }[];
    no: {
      name: string;
      id: string;
    }[];
    abstain: {
      name: string;
      id: string;
    }[];
  } | null;
  message: string;
}> {
  try {
    if (pollId) {
      const response = await axios.get(`/api/getPollResults/${pollId}`, {
        method: 'GET',
        headers: {
          'X-Custom-Header': 'intersect',
        },
      });
      const data = await response.data;
      if (response.status === 200) {
        return { votes: data.votes, message: 'Poll Results found' };
      } else {
        return { votes: null, message: data.message };
      }
    } else {
      return { votes: null, message: 'Error getting Poll Results' };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { votes: null, message: error.response.data.message };
    } else {
      return { votes: null, message: 'An error occurred getting poll results' };
    }
  }
}
