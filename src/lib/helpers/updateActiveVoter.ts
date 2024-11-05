import axios from 'axios';

/**
 * Updates the active voter for a workshop, can be a delegate or alternate
 * @param name - The name of the user
 * @param email - The email of the user
 * @param wallet_address - The wallet address of the user
 * @returns UserId - The ID of the newly activated voter
 * @returns Message - An error message if the active voter updating failed
 */
export async function updateActiveVoter(
  workshopId: string,
  activeVoterId: string,
): Promise<{ userId: string; message: string }> {
  try {
    const response = await axios.post(
      '/api/updateActiveVoter',
      {
        workshopId: workshopId,
        activeVoterId: activeVoterId,
      },
      {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      },
    );
    const data = await response.data;
    if (response.status === 200) {
      return { userId: data.userId, message: 'Active voter updated' };
    } else {
      return { userId: '-1', message: data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { userId: '-1', message: error.response.data.message };
    } else {
      return { userId: '-1', message: 'An error occurred' };
    }
  }
}
