import { newPollInternalErrorHandler } from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { CreatePollButton } from '@/components/buttons/createPollButton';

test('alerts user when poll creation fails', async () => {
  server.use(...newPollInternalErrorHandler);
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <CreatePollButton
        name="test poll"
        description="this is a test poll"
        setName={() => {}}
        setDescription={() => {}}
      />
    </>,
  );

  const createPollButton = screen.getByRole('button', {
    name: /Submit/i,
  });
  expect(createPollButton).toBeDefined();
  await user.click(createPollButton);
  const toast = await screen.findByText(/Error creating new Poll./i);
  expect(toast).toBeDefined();
});
