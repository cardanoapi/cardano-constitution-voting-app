import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollStatusChip } from '@/components/polls/pollStatusChip';

test('shows voting when the poll is open for voting', async () => {
  render(<PollStatusChip status="voting" />);

  const votingText = screen.getByText(/voting/i);
  expect(votingText).toBeDefined();
});
