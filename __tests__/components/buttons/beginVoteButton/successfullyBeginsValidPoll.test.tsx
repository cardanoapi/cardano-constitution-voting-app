import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { BeginVoteButton } from '@/components/buttons/beginVoteButton';

test('successfully begins valid poll', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <BeginVoteButton
        pollId="1"
        isSubmitting={false}
        setIsSubmitting={() => {}}
      />
      ,
    </>,
  );

  const beginVoteButton = screen.getByRole('button', {
    name: /Begin Voting/i,
  });
  expect(beginVoteButton).toBeDefined();
  await user.click(beginVoteButton);
  const successToast = await screen.findByText('Poll voting is open!');
  expect(successToast).toBeDefined();
});
