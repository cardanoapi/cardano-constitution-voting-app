import { User } from '@/types';

/**
 * Fetches all delegates and alternates from the database
 * @returns User[] - The delegates & alternates
 */
export async function getRepresentatives(): Promise<User[]> {
  const response = await fetch('/api/getRepresentatives', {
    headers: { 'X-Custom-Header': 'intersect' },
  });
  if (response.status === 200) {
    const users = await response.json();
    // only return delegates & alternates
    const reps = users.filter(
      (rep: User) => rep.is_delegate || rep.is_alternate,
    );
    return reps;
  } else {
    return [];
  }
}
