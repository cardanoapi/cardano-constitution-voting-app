/**
 * Moves a poll from pending to voting
 * @param pollId - The ID of the poll to start voting on
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully started, false otherwise with a message
 */
export async function startVoting(
  pollId: string,
): Promise<{ succeeded: boolean; message: string }> {
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
    return { succeeded: true, message: 'Voting started' };
  } else {
    return { succeeded: false, message: data.message };
  }
}
