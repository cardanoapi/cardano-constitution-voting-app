import { server } from '@/../__mocks__/server';
import { updateUserActiveVoteHandler } from '@/../__mocks__/updateUser/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

test('Successfully alerts when they try editing active voter while voting', async () => {
  server.use(...updateUserActiveVoteHandler);
  const user = userEvent.setup();
  render(
    <>
      <Toaster />
      <ManageRepresentativesTable />
    </>,
  );

  const submitButton = await screen.findByTestId('edit-representative-info-1');
  await user.click(submitButton);

  const saveButton = await screen.findByTestId('save-representative-info-1');
  await user.click(saveButton);

  // Wait for the error toast to appear
  const errorToast = await screen.findByText(
    'You cannot update user information while a Poll is actively voting.',
  );
  expect(errorToast).toBeDefined();
});
