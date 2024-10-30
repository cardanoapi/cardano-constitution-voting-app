import { Poll } from '@/types';

/**
 * Fetches all polls from the database
 * @returns Array of Polls
 */
export async function getPolls(): Promise<Poll[]> {
  const response = await fetch('/api/getPolls', {
    headers: { 'X-Custom-Header': 'intersect' },
  });

  if (response.status === 200) {
    const polls = await response.json();
    // sort polls by id
    polls.sort((a: Poll, b: Poll) => {
      return Number(a.id) - Number(b.id);
    });
    return polls;
  } else {
    return [];
  }
}
