import toast from 'react-hot-toast';

/**
 * Gets all votes for a poll
 * @param stakeAddress - The user's stake address
 * @returns User - The user's information
 */
export async function getPollVoteCount(pollId: string): Promise<number> {
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
      toast.error(data.message);
      return 0;
    }
  } else {
    return 0;
  }
}
