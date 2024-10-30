import { User } from '@/types';

/**
 * Fetches data for a user by user id
 * @param userId - The user's id
 * @returns User - The user's information
 */
export async function getUser(userId: string): Promise<{
  user: User | null;
  message: string;
}> {
  let response: Response;
  if (userId && typeof userId === 'string') {
    response = await fetch(`/api/getUser/${userId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      if (data.user) {
        return {
          user: data.user,
          message: 'User found',
        };
      } else {
        return {
          user: null,
          message: data.message,
        };
      }
    } else {
      return {
        user: null,
        message: data.message,
      };
    }
  } else {
    return {
      user: null,
      message: 'Invalid userId',
    };
  }
}
