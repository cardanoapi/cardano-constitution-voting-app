import toast from 'react-hot-toast';

/**
 * Moves a poll from pending to voting
 * @param pollId - The ID of the poll to start voting on
 * @returns Boolean - True if the poll started voting successfully, false otherwise
 */
export async function startVoting(pollId: string): Promise<boolean> {
  const response = await fetch('/api/startVoting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'intersect',
    },
    body: JSON.stringify({
      pollId: pollId,
    }),
  });
  const data = await response.json();
  if (response.status === 200) {
    toast.success('Poll voting is open!');
    return data.pollId;
  } else {
    toast.error(data.message);
    return false;
  }
}
