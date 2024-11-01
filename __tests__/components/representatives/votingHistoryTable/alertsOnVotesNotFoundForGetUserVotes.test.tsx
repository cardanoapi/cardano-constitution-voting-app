import {
  getUserVotesInternalErrorHandler,
  getUserVotesNotFoundHandler,
} from '@/../__mocks__/getUserVotes/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

test('Alerts on Votes not found for getUserVotes', async () => {
  server.use(...getUserVotesNotFoundHandler);
  render(
    <>
      <VotingHistoryTable userId={'1'} />
      <Toaster />
    </>,
  );
  expect(await screen.findByText('Votes not found')).toBeDefined();
});

test('Alerts on internal error fetching user votes for getUserVotes', async () => {
  server.use(...getUserVotesInternalErrorHandler);
  render(
    <>
      <VotingHistoryTable userId={'1'} />
      <Toaster />
    </>,
  );
  expect(await screen.findByText('Error fetching user votes')).toBeDefined();
});
