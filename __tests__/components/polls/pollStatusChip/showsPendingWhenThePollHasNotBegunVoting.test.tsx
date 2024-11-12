import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollStatusChip } from '@/components/polls/pollStatusChip';

test('shows pending when the poll has not begun voting', async () => {
  render(<PollStatusChip status="pending" />);

  const pendingText = screen.getByText(/pending/i);
  expect(pendingText).toBeDefined();
});
