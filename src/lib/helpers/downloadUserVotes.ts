import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Downloads all votes for a single user and exports them to a CSV file
 * @param userId - The ID of the user to download votes for
 * @returns { succeeded: boolean, message: string } - True if votes were successfully downloaded, false otherwise with a message
 */
export async function downloadUserVotes(
  userId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/downloadUserVotes',
      {
        userId: userId,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
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
      return { succeeded: true, message: 'User votes downloaded' };
    } else {
      const message = JSON.parse(await response.data.text()).message;
      return { succeeded: false, message: message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message = JSON.parse(await error.response.data.text()).message;
      return {
        succeeded: false,
        message: message,
      };
    } else {
      Sentry.captureException(error);
      return {
        succeeded: false,
        message: "An error occurred downloading user's votes",
      };
    }
  }
}
