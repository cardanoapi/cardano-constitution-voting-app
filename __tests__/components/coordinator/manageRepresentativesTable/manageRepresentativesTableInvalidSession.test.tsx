import { server } from '@/../__mocks__/server';
import { updateUserInvalidSessionHandler } from '@/../__mocks__/updateUser/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

test('Successfully alerts on internal error', async () => {
  server.use(...updateUserInvalidSessionHandler);
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
    'You must be signed in as an Organizer update user information.',
  );
  expect(errorToast).toBeDefined();
});
