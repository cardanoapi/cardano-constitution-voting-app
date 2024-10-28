import { Poll } from '@/types';

/**
 * Fetches a poll from the database by PollId
 * @param pollId - The ID of the poll to fetch
 * @returns Poll - The poll with the given ID
 */
export async function getPoll(pollId: string): Promise<Poll | null> {
  const response = await fetch(`/api/getPoll/${pollId}`, {
    headers: { 'X-Custom-Header': 'intersect' },
  });
  if (response.status === 200) {
    const poll = await response.json();
    return poll;
  } else {
    return null;
  }
}
