import { newPollVoteNotVotingHandler } from '@/../__mocks__/newPollVote/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { VoteOnPollButtons } from '@/components/buttons/voteOnPollButtons';

test('alerts user when poll is not open for voting yet', async () => {
  server.use(...newPollVoteNotVotingHandler);
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

  const yesVoteButton = screen.getByRole('button', {
    name: /yes/i,
  });
  expect(yesVoteButton).toBeDefined();
  await user.click(yesVoteButton);
  const toast = await screen.findByText(/poll is not voting/i);
  expect(toast).toBeDefined();
});
