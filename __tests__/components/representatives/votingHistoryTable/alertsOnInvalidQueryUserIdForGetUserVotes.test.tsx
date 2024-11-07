import { getUserVotesInvalidUserIdHandler } from '@/../__mocks__/getUserVotes/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

test('Alerts on Invalid query userId for getUserVotes', async () => {
  server.use(...getUserVotesInvalidUserIdHandler);
  render(
    <>
      <VotingHistoryTable userId={'1'} />
      <Toaster />
    </>,
  );
  expect(await screen.findByText('Invalid query userId')).toBeDefined();
});
