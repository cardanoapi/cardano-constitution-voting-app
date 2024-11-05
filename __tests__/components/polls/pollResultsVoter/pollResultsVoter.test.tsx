import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollResultsVoter } from '@/components/polls/pollResultsVoter';

test('successfully renders poll results voter', async () => {
  render(<PollResultsVoter name="John Johnson" id="1" vote="yes" />);
  expect(await screen.findByTestId('representative-vote-1')).toBeDefined();
});
