import { PollVote, User } from '@/types';

/**
 * Gets all of a user's votes by their id
 * @param userId - The user's id
 * @returns User - The user's votes
 */
export async function getUserVotes(userId: string): Promise<PollVote[]> {
  let response: Response;
  if (userId && typeof userId === 'string') {
    response = await fetch(`/api/getUserVotes/${userId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.votes) {
        return data.votes;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
}
