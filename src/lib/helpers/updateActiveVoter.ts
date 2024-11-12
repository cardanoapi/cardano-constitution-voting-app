import axios from 'axios';

/**
 * Updates the active voter for a workshop, can be a delegate or alternate
 * @param workshopId - The ID of the workshop
 * @param activeVoterId - The ID of the delegate/alternate to make the active voter
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
