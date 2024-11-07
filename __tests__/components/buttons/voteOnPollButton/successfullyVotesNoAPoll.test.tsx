import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';

test('successfully votes no on a poll', async () => {
  const user = userEvent.setup();
  render(
    <SessionProvider
      session={{
        expires: '1',
        user: {
          id: '1',
          stakeAddress: 'stakeAddress',
          walletName: 'walletName',
        },
      }}
    >
      <Toaster />
      <VoteOnPollButtons
        poll={{
          id: '1',
          name: 'testPoll',
          description: 'this is a test poll',
          status: 'voting',
        }}
        disabled={false}
        setDisabled={() => {}}
      />
    </SessionProvider>,
  );

  const noVoteButton = screen.getByRole('button', {
    name: /no/i,
  });
  expect(noVoteButton).toBeDefined();
  await user.click(noVoteButton);
  const toast = await screen.findByText(/vote recorded/i);
  expect(toast).toBeDefined();
});
