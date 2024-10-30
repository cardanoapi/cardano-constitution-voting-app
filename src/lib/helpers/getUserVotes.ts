import { PollVote, User } from '@/types';

/**
 * Gets all of a user's votes by their id
 * @param userId - The user's id
 * @returns User - The user's votes
 */
export async function getUserVotes(
  userId: string,
): Promise<{ votes: PollVote[]; message: string }> {
  let response: Response;
  if (userId && typeof userId === 'string') {
    response = await fetch(`/api/getUserVotes/${userId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      if (data.votes) {
        return { votes: data.votes, message: 'User votes found' };
      } else {
        return { votes: [], message: data.message };
      }
    } else {
      return { votes: [], message: data.message };
    }
  } else {
    return { votes: [], message: 'Invalid userId' };
  }
}
