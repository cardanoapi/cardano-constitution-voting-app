import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

test('successfully renders table with all votes', async () => {
  render(<VotingHistoryTable userId={'1'} />);
  expect(await screen.findByTestId('yes-1')).toBeDefined();
  expect(await screen.findByTestId('no-2')).toBeDefined();
  expect(await screen.findByTestId('abstain-3')).toBeDefined();
});
