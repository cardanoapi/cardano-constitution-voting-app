/**
 * Moves a poll from voting to concluded
 * @param pollId - The ID of the poll to end voting on
 * @returns Boolean - True if the poll voting was successfully ended, false otherwise
 */
export async function endVoting(pollId: string): Promise<string | undefined> {
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
    return;
  } else {
    return data.message;
  }
}
