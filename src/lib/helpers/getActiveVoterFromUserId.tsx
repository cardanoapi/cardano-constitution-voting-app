import axios from 'axios';

/**
 * Fetches a poll from the database by PollId
 * @param userId - The ID of the user ID
 * @returns Poll - The poll with the given ID
 */
export async function getActiveVoterFromUserId(
  userId: string,
): Promise<{ activeVoterId: string; message: string }> {
  try {
    const response = await axios.get(
      `/api/getActiveVoterFromUserId/${userId}`,
      {
        headers: { 'X-Custom-Header': 'intersect' },
      },
    );
    const data = await response.data;

    if (response.status === 200) {
      return { activeVoterId: data.activeVoter, message: 'Active voter found' };
    } else {
      return { activeVoterId: '', message: data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { activeVoterId: '', message: error.response.data.message };
    } else {
      return {
        activeVoterId: '',
        message: 'An error occurred getting active voter',
      };
    }
  }
}
