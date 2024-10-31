import axios from 'axios';

/**
 * Moves a poll from pending to voting
 * @param pollId - The ID of the poll to start voting on
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully started, false otherwise with a message
 */
export async function startVoting(
  pollId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/startVoting',
      {
        pollId: pollId,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'Voting started' };
    } else {
      return { succeeded: false, message: data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, message: error.response.data.message };
    } else {
      return { succeeded: false, message: 'An error occurred starting voting' };
    }
  }
}
