import { server } from '@/../__mocks__/server';
import { updateUserTooLongEmailHandler } from '@/../__mocks__/updateUser/errorHandlers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

test('Successfully alerts on internal error', async () => {
  server.use(...updateUserTooLongEmailHandler);
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
    'Email must be less than 100 characters.',
  );
  expect(errorToast).toBeDefined();
});
