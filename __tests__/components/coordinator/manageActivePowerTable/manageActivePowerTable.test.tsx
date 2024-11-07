import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageActivePowerTable } from '@/components/coordinator/manageActivePowerTable';

test('Successfully updates active voter', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ManageActivePowerTable />
      <Toaster />
    </>,
  );

  const submitButton = await screen.findByTestId('edit-active-voter-1');
  await user.click(submitButton);

  const saveButton = await screen.findByTestId('save-active-voter-1');
  await user.click(saveButton);

  // Wait for the success toast to appear
  const successToast = await screen.findByText('Active voter updated!');
  expect(successToast).toBeDefined();
});
