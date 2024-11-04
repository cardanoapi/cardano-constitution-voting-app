import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('does not render vote count when pending', async () => {
  render(
    <>
      <Toaster />
      <PollCard
        poll={{
          id: '1',
          name: 'test',
          description: 'test description',
          status: 'pending',
        }}
      />
    </>,
  );
  const voteCount = screen.queryByText('1 vote');
  expect(voteCount).toBeNull();
});
