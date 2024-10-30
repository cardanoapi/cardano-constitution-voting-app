/**
 * Casts a vote on a poll
 * @param pollId - The ID of the poll to cast a vote on
 * @param vote - The vote to cast
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully started, false otherwise with a message
 */
export async function castVote(
  pollId: string,
  vote: string,
): Promise<{ succeeded: boolean; message: string }> {
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
    return { succeeded: true, message: 'Vote cast' };
  } else {
    return { succeeded: false, message: data.message };
  }
}
