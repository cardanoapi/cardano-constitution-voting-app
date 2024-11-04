import { getPollVoteCountInvalidIdHandler } from '@/../__mocks__/getPollVoteCount/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('alerts user when poll ID is invalid', async () => {
  server.use(...getPollVoteCountInvalidIdHandler);
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

  const toast = await screen.findByText(/Invalid pollId/i);
  expect(toast).toBeDefined();
});
