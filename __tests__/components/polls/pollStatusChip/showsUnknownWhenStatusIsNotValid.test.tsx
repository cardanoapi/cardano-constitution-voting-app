import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollStatusChip } from '@/components/polls/pollStatusChip';

test('shows unknown when status is not valid', async () => {
  render(<PollStatusChip status="invalid status" />);

  const unknownText = screen.getByText(/unknown/i);
  expect(unknownText).toBeDefined();
});
