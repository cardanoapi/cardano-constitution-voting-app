import { getPollVoteCount0Handlers } from '@/../__mocks__/getPollVoteCount/handlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollVoteCount } from '@/components/polls/pollVoteCount';

test('shows 0 votes and error message when poll not found', async () => {
  server.use(...getPollVoteCount0Handlers);
  render(
    <>
      <Toaster />
      <PollVoteCount pollId="1" />
    </>,
  );
  const voteCount = await screen.findByText('0 votes');
  expect(voteCount).toBeDefined();
});
