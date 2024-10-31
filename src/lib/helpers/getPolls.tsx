import axios from 'axios';

import { Poll } from '@/types';

/**
 * Fetches all polls from the database
 * @returns Array of Polls
 */
export async function getPolls(): Promise<Poll[]> {
  try {
    const response = await axios.get('/api/getPolls', {
      headers: { 'X-Custom-Header': 'intersect' },
    });

    if (response.status === 200) {
      const polls = await response.data;
      // sort polls by id
      polls.sort((a: Poll, b: Poll) => {
        return Number(a.id) - Number(b.id);
      });
      return polls;
    } else {
      return [];
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return [];
    } else {
      return [];
    }
  }
}
