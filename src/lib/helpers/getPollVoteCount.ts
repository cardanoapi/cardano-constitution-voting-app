import toast from 'react-hot-toast';

/**
 * Gets all votes for a poll
 * @param stakeAddress - The user's stake address
 * @returns User - The user's information
 */
export async function getPollVoteCount(
  pollId: string,
): Promise<{ votes: number; error?: string }> {
  let response: Response;
  if (pollId) {
    response = await fetch(`/api/getPollVoteCount/${pollId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    const data = await response.json();

    if (response.status === 200) {
      return data.count;
    } else {
      return { votes: 0, error: data.message };
    }
  } else {
    return { votes: 0, error: 'Error getting vote count' };
  }
}
