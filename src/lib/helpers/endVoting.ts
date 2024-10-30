/**
 * Moves a poll from voting to concluded
 * @param pollId - The ID of the poll to end voting on
 * @returns { succeeded: boolean, message: string } - True if the poll voting was successfully started, false otherwise with a message
 */
export async function endVoting(
  pollId: string,
): Promise<{ succeeded: boolean; message: string }> {
  const response = await fetch('/api/endVoting', {
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
    return { succeeded: true, message: 'Voting ended' };
  } else {
    return { succeeded: false, message: data.message };
  }
}
