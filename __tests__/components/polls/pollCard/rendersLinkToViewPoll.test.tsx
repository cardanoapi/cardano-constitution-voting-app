import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('renders link to view poll', async () => {
  render(
    <>
      <Toaster />
      <PollCard
        poll={{
          id: '1',
          name: 'test',
          description: 'test description',
          status: 'voting',
        }}
      />
    </>,
  );
  const viewPollLink = screen.getByTestId('poll-card-1');
  expect(viewPollLink).toBeDefined();
});
