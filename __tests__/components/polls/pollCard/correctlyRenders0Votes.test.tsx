import { getPollVoteCount0Handlers } from '@/../__mocks__/getPollVoteCount/handlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('correctly renders 0 votes', async () => {
  server.use(...getPollVoteCount0Handlers);
  render(
    <>
      <Toaster />
      <PollCard
        poll={{
          id: '1',
          name: 'test',
          description: 'test description',
          status: 'voting',
        }}
      />
    </>,
  );
  const voteCount = await screen.findByText('0 votes');
  expect(voteCount).toBeDefined();
});
