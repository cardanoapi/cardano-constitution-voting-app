import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Downloads all votes for a single poll and exports them to a CSV file
 * @param pollId - The ID of the poll to download votes for
 * @returns { succeeded: boolean, message: string } - True if votes were successfully downloaded, false otherwise with a message
 */
export async function downloadPollVotes(
  pollId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/downloadPollVotes',
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
    if (response.status === 200) {
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const headers = response.headers;
      const fileName = headers['file-name'];
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      return { succeeded: true, message: 'Poll votes downloaded' };
    } else {
      const data = response.data;
      return { succeeded: false, message: data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, message: error.response.data.message };
    } else {
      Sentry.captureException(error);
      return {
        succeeded: false,
        message: "An error occurred downloading poll's votes",
      };
    }
  }
}
