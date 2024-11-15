import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Archives a poll in the database
 * @param pollId - The ID of the poll to archive
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully archived, false otherwise with a message
 */
export async function archivePoll(
  pollId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/archivePoll',
      {
        pollId: pollId,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
        responseType: 'blob',
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'Poll Deleted' };
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
        message: 'An error occurred deleting Poll.',
      };
    }
  }
}
