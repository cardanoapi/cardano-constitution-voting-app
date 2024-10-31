import {
  getUserVotesInternalErrorHandler,
  getUserVotesInvalidMethodHandler,
  getUserVotesInvalidUserIdHandler,
  getUserVotesNotFoundHandler,
} from '@/../__mocks__/getUserVotes/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

test('successfully renders table with all votes', async () => {
  render(<VotingHistoryTable userId={'1'} />);
  expect(await screen.findByTestId('yes-1')).toBeDefined();
  expect(await screen.findByTestId('no-2')).toBeDefined();
  expect(await screen.findByTestId('abstain-3')).toBeDefined();
});

test('Alerts on incorrect method for getUserVotes', async () => {
  server.use(...getUserVotesInvalidMethodHandler);
  render(
    <>
      <VotingHistoryTable userId={'1'} />
      <Toaster />
    </>,
  );
  expect(await screen.findByText('Method not allowed')).toBeDefined();
});

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
