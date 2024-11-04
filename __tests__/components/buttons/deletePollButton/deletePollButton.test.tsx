import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { DeletePollButton } from '@/components/buttons/deletePollButton';

import { deletePollErrorHandlers } from '../../../../__mocks__/deletePoll/errorHandlers';
import { server } from '../../../../__mocks__/server';

test('successfully deletes poll', async () => {
  const user = userEvent.setup();

  render(
    <>
      <DeletePollButton
        pollId="1"
        isSubmitting={false}
        setIsSubmitting={() => {}}
      />
      <Toaster />
    </>,
  );

  const submitButton = screen.getByRole('button');
  await user.click(submitButton);

  expect(await screen.findByText('Poll deleted!')).toBeDefined();
});

test('alerts user when poll is not deleted', async () => {
  server.use(...deletePollErrorHandlers);
  const user = userEvent.setup();

  render(
    <>
      <DeletePollButton
        pollId="1"
        isSubmitting={false}
        setIsSubmitting={() => {}}
      />
      <Toaster />
    </>,
  );

  const submitButton = screen.getByRole('button');
  await user.click(submitButton);

  expect(await screen.findByText('Error deleting Poll')).toBeDefined();
});
