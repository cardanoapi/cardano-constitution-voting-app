import axios from 'axios';

/**
 * Deletes a poll from the database
 * @param pollId - The ID of the poll to delete
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully deleted, false otherwise with a message
 */
export async function deletePoll(
  pollId: string,
): Promise<{ succeeded: boolean; message: string }> {
  try {
    const response = await axios.delete(`/api/deletePoll/${pollId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'intersect',
      },
    });
    const data = await response.data;
    if (response.status === 200) {
      return { succeeded: true, message: 'Poll Deleted' };
    } else {
      return { succeeded: false, message: data.message };
    }
  } catch (error) {
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
