import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { VotingHistoryTable } from '@/components/representatives/votingHistoryTable';

test('successfully renders none if no vote', async () => {
  render(<VotingHistoryTable userId={'1'} />);
  expect(await screen.findByText(/none/i)).toBeDefined();
});
