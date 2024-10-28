import toast from 'react-hot-toast';

/**
 * Casts a vote on a poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param vote - The vote to cast
 * @returns PollId - The ID of the newly created poll
 */
export async function castVote(pollId: string, vote: string): Promise<string> {
  const response = await fetch('/api/newPollVote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'intersect',
    },
    body: JSON.stringify({
      pollId: pollId,
      vote: vote,
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
