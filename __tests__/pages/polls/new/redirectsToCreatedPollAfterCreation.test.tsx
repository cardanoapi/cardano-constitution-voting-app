import NewPoll from '@/pages/polls/new';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import { expect, test } from 'vitest';

test('redirects to created poll after creation', async () => {
  const user = userEvent.setup();

  render(<NewPoll />);
  const nameInput = screen.getByLabelText('Name');
  await user.type(nameInput, 'testName');

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(mockRouter).toMatchObject({
      asPath: '/polls/1',
    });
  });
});
