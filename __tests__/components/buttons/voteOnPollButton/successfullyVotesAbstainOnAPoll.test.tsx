import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';

test('successfully votes abstain on a poll', async () => {
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

  const abstainVoteButton = screen.getByRole('button', {
    name: /abstain/i,
  });
  expect(abstainVoteButton).toBeDefined();
  await user.click(abstainVoteButton);
  const toast = await screen.findByText(/vote recorded/i);
  expect(toast).toBeDefined();
});
