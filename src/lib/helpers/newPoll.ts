import toast from 'react-hot-toast';

/**
 * Creates a new Poll
 * @param name - The name of the poll
 * @param description - The description of the poll
 * @returns PollId - The ID of the newly created poll
 */
export async function newPoll(
  name: string,
  description: string,
): Promise<{ pollId: string; message: string }> {
  const response = await fetch('/api/newPoll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'intersect',
    },
    body: JSON.stringify({
      name: name,
      description: description,
    }),
  });
  const data = await response.json();
  if (response.status === 200) {
    return { pollId: data.pollId, message: 'Poll created' };
  } else {
    return { pollId: '-1', message: data.message };
  }
}
