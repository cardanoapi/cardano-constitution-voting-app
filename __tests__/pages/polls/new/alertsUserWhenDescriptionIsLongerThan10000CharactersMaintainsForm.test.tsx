import { newPollTooLongDescriptionHandler } from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

test('alerts user when description is longer than 10,000 characters, maintains form', async () => {
  server.use(...newPollTooLongDescriptionHandler);
  const user = userEvent.setup();

  render(
    <>
      <Toaster />
      <NewPoll />
    </>,
  );

  const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
  await user.type(nameInput, 'testName');

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  const errorToast = await screen.findByText(
    /Description must be less than 10,000 characters./i,
  );
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(nameInput.value).toEqual('testName');
  expect(descriptionInput.textContent).toEqual('testDescription');
});
