import axios from 'axios';

/**
 * Casts a vote on a poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param vote - The vote to cast
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully started, false otherwise with a message
 */
export async function castVote(
  pollId: string,
  vote: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.post(
      '/api/newPollVote',
      {
        pollId: pollId,
        vote: vote,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'Vote cast' };
    } else {
      return { succeeded: false, message: data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { succeeded: false, message: error.response.data.message };
    } else {
      return { succeeded: false, message: 'An error occurred casting vote' };
    }
  }
}
