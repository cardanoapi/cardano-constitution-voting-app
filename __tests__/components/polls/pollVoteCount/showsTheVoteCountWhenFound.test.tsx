import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollVoteCount } from '@/components/polls/pollVoteCount';

test('shows the vote count when found', async () => {
  render(<PollVoteCount pollId="1" />);

  const voteCount = await screen.findByText(/1 vote/i);
  expect(voteCount).toBeDefined();
});
