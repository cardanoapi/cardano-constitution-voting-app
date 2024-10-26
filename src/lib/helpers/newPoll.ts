import toast from 'react-hot-toast';

import { Poll } from '@/types';

/**
 * Creates a new Poll
 * @param name - The name of the poll
 * @param description - The description of the poll
 * @returns PollId - The ID of the newly created poll
 */
export async function newPoll(
  name: string,
  description: string,
): Promise<string> {
  const response = await fetch('/api/newPoll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      description: description,
    }),
  });
  const data = await response.json();
  if (response.status === 200) {
    return data.pollId;
  } else {
    toast.error(data.message);
    return '-1';
  }
}
