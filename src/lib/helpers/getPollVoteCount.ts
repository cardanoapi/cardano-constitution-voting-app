/**
 * Gets all votes for a poll
 * @param stakeAddress - The user's stake address
 * @returns Votes - The number of votes for the poll
 * @returns Message - An error message if the vote count fetch failed
 */
export async function getPollVoteCount(
  pollId: string,
): Promise<{ votes: number; message: string }> {
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
      return { votes: data.count, message: 'Vote count found' };
    } else {
      return { votes: -1, message: data.message };
    }
  } else {
    return { votes: -1, message: 'Error getting vote count' };
  }
}
