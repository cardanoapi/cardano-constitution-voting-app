import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { Poll } from '@/types';

/**
 * Fetches a poll from the database by PollId
 * @param pollId - The ID of the poll to fetch
 * @returns Poll - The poll with the given ID
 */
export async function getPoll(
  pollId: string,
): Promise<{ poll: Poll | null; message: string }> {
  try {
    const response = await axios.get(`/api/getPoll/${pollId}`, {
      headers: { 'X-Custom-Header': 'intersect' },
    });
    const data = await response.data;

    if (response.status === 200) {
      return { poll: data.poll, message: 'Poll found' };
    } else {
      return { poll: null, message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { poll: null, message: error.response.data.message };
    } else {
      return {
        poll: null,
        message: 'An error occurred getting poll information',
      };
    }
  }
}
