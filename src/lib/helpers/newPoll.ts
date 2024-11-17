import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Creates a new Poll
 * @param name - The name of the poll
 * @param description - The description of the poll
 * @returns PollId - The ID of the newly created poll
 */
export async function newPoll(
  name: string,
  description: string,
): Promise<{ pollId: string; message: string }> {
  try {
    const response = await axios.post(
      '/api/newPoll',
      {
        name: name,
        description: description,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { pollId: data.pollId, message: 'Poll created' };
    } else {
      return { pollId: '-1', message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { pollId: '-1', message: error.response.data.message };
    } else {
      return { pollId: '-1', message: 'An error occurred' };
    }
  }
}
