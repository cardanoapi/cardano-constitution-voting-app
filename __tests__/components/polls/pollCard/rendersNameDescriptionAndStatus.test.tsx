import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { PollCard } from '@/components/polls/pollCard';

test('renders name, description, and status', async () => {
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
  const name = screen.getByText('test');
  const description = screen.getByText('test description');
  const status = screen.getByText('Voting');
  expect(name).toBeDefined();
  expect(description).toBeDefined();
  expect(status).toBeDefined();
});
