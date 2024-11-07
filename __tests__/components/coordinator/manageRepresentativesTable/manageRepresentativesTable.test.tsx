import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

import { ManageRepresentativesTable } from '@/components/coordinator/manageRepresentativesTable';

test('Successfully edits user information', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ManageRepresentativesTable />
      <Toaster />
    </>,
  );

  const submitButton = await screen.findByTestId('edit-representative-info-1');
  await user.click(submitButton);

  const saveButton = await screen.findByTestId('save-representative-info-1');
  await user.click(saveButton);

  // Wait for the success toast to appear
  const successToast = await screen.findByText('User info updated!');
  expect(successToast).toBeDefined();
});
