import { getPollVoteCountInternalErrorHandler } from '@/../__mocks__/getPollVoteCount/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('alerts user when fails to get poll vote count', async () => {
  server.use(...getPollVoteCountInternalErrorHandler);
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

  const toast = await screen.findByText(/Error getting Poll Vote Count/i);
  expect(toast).toBeDefined();
});
