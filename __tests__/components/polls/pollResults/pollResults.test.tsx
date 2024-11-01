import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { PollResults } from '@/components/polls/pollResults';

test('successfully renders poll results', async () => {
  render(<PollResults pollId="1" />);
  expect(screen.findByText('Results')).toBeDefined();
  expect(screen.findByText('YES')).toBeDefined();
  expect(screen.findByText('NO')).toBeDefined();
  expect(screen.findByText('ABSTAIN')).toBeDefined();
  expect(screen.findByText('Voted:')).toBeDefined();
});
