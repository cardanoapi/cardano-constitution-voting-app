import {
  getPollResultsInternalErrorHandler,
  getPollResultsInvalidIdHandler,
} from '@/../__mocks__/getPollResults/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollResults } from '@/components/polls/pollResults';

test('successfully renders poll results', async () => {
  render(<PollResults pollId="1" />);
  expect(
    await screen.findByRole('heading', { name: /Results/i }),
  ).toBeDefined();
  expect(await screen.findByRole('heading', { name: /YES/i })).toBeDefined();
  expect(await screen.findByRole('heading', { name: /NO/i })).toBeDefined();
  expect(
    await screen.findByRole('heading', { name: /ABSTAIN/i }),
  ).toBeDefined();
  expect(await screen.findByText(/4/i)).toBeDefined();
  expect(await screen.findByText(/1/i)).toBeDefined();

  expect(await screen.findByText(/80%/i)).toBeDefined();
  expect(await screen.findByText(/20%/i)).toBeDefined();
});

test('renders no votes & alerts user when invalid poll id is used', async () => {
  server.use(...getPollResultsInvalidIdHandler);
  render(
    <>
      <PollResults pollId="1" />
      <Toaster />
    </>,
  );

  expect(await screen.findAllByText(/0%/i)).toBeDefined();
  expect(await screen.findByText('Invalid pollId')).toBeDefined();
});

test('renders no votes & alerts user internal error occurs getting poll results', async () => {
  server.use(...getPollResultsInternalErrorHandler);
  render(
    <>
      <PollResults pollId="1" />
      <Toaster />
    </>,
  );

  expect(await screen.findAllByText(/0%/i)).toBeDefined();
  expect(
    await screen.findByText('Error getting Poll Vote Count.'),
  ).toBeDefined();
});
