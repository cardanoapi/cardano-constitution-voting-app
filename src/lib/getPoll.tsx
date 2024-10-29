import { Poll } from '@/types';

/**
 * Fetches a poll from the database by PollId
 * @param pollId - The ID of the poll to fetch
 * @returns Poll - The poll with the given ID
 */
export async function getPoll(
  pollId: string,
): Promise<{ poll: Poll | null; message: string }> {
  const response = await fetch(`/api/getPoll/${pollId}`, {
    headers: { 'X-Custom-Header': 'intersect' },
  });
  const data = await response.json();

  if (response.status === 200) {
    return { poll: data.poll, message: 'Poll found' };
  } else {
    return { poll: null, message: data.message };
  }
}
