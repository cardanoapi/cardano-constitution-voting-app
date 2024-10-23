import { newPollHandlers } from '@/../__mocks__/newPoll/handlers';
import { server } from '@/../__mocks__/server';

test('properly creates a new poll', async () => {
  server.use(...newPollHandlers);
  const response = await fetch('/api/newPoll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'New Poll',
      description: 'This is a new poll',
    }),
  });
  const data = await response.json();
  expect(data.pollId).not.toBe('-1');
});
