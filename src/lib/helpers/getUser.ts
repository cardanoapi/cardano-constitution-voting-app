import { User } from '@/types';

/**
 * Fetches data for a user by user id
 * @param userId - The user's id
 * @returns User - The user's information
 */
export async function getUser(userId: string): Promise<User | null> {
  let response: Response;
  if (userId && typeof userId === 'string') {
    response = await fetch(`/api/getUser/${userId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.user) {
        return data.user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}
