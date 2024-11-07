import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollStatusChip } from '@/components/polls/pollStatusChip';

test('shows concluded when the poll has closed voting', async () => {
  render(<PollStatusChip status="concluded" />);

  const concludedText = screen.getByText(/concluded/i);
  expect(concludedText).toBeDefined();
});
