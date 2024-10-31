/**
 * Gets a user's vote for a poll
 * @param userId - The ID of the user to fetch
 * @param pollId - The ID of the poll to fetch
 * @returns Vote - yes, no, abstain, or empty string if none or error
 */
export async function getUserVote(
  userId: string,
  pollId: string,
): Promise<{ vote: string; message: string }> {
  const response = await fetch(`/api/getPollVote/${userId}/${pollId}`, {
    headers: { 'X-Custom-Header': 'intersect' },
  });
  const data = await response.json();

  if (response.status === 200) {
    return { vote: data.vote, message: 'Vote found' };
  } else {
    return { vote: '', message: data.message };
  }
}
