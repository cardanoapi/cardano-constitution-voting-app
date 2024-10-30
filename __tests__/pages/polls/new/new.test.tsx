import {
  newPollNoDescriptionHandler,
  newPollNoNameHandler,
  newPollTooLongDescriptionHandler,
  newPollTooLongNameHandler,
} from '@/../__mocks__/newPoll/errorHandlers';
import { server } from '@/../__mocks__/server';
import NewPoll from '@/pages/polls/new';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import { Toaster } from 'react-hot-toast';
import { expect, test } from 'vitest';

test('renders the form with name and description inputs', () => {
  render(<NewPoll />);

  // Check if the form elements are rendered
  expect(screen.getByLabelText(/Name/i)).toBeDefined();
  expect(screen.getByLabelText(/Description/i)).toBeDefined();
  expect(screen.getByRole('button', { name: /Submit/i })).toBeDefined();
});

test('clears new poll form after creation', async () => {
  const user = userEvent.setup();

  render(
    <>
      <NewPoll />
    </>,
  );
  const nameInput = screen.getByLabelText('Name');
  await user.type(nameInput, 'testName');

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  // Ensure the form fields are cleared
  expect(nameInput.textContent).toBe('');
  expect(descriptionInput.textContent).toBe('');
});

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

test('alerts user when name is empty, maintains form', async () => {
  server.use(...newPollNoNameHandler);
  const user = userEvent.setup();

  render(
    <>
      <Toaster />
      <NewPoll />
    </>,
  );

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  // Wait for the error toast to appear
  const errorToast = await screen.findByText(/Name must be provided./i);
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(descriptionInput.textContent).toEqual('testDescription');
});

test('alerts user when name is longer than 255 characters, maintains form', async () => {
  server.use(...newPollTooLongNameHandler);
  const user = userEvent.setup();

  render(
    <>
      <Toaster />
      <NewPoll />
    </>,
  );

  const nameInput = screen.getByRole('textbox', {
    name: /Name/i,
  }) as HTMLInputElement;
  await user.type(
    nameInput,
    'fdsfdasfjkdlsjfklds;jfkldsjfklds;jfkldsjfkld;sjfkldsjfklds;jadfkl;dsjfklds;ajfksd;jfkldsajfkdsa;jfkl;dsfjdsauf89dsu8f9dus9afuds89fu8d9sfud8s9auf89dsauf89sduf89sdpuf89psdauf89pdsauf89dsuf89dsuf89dsuf89dsauf89dsuf89dsauf89sduf89psauf89pdsuf89dpsuf89pdsuf89sauf8d9sauf89dsuf89pdsauf',
  );

  const descriptionInput = screen.getByLabelText('Description');
  await user.type(descriptionInput, 'testDescription');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  // Wait for the error toast to appear
  const errorToast = expect(
    screen.findByText(/Name must be less than 255 characters./i),
  ).toBeDefined();
  screen.debug();
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(nameInput.value).toEqual(
    'fdsfdasfjkdlsjfklds;jfkldsjfklds;jfkldsjfkld;sjfkldsjfklds;jadfkl;dsjfklds;ajfksd;jfkldsajfkdsa;jfkl;dsfjdsauf89dsu8f9dus9afuds89fu8d9sfud8s9auf89dsauf89sduf89sdpuf89psdauf89pdsauf89dsuf89dsuf89dsuf89dsauf89dsuf89dsauf89sduf89psauf89pdsuf89dpsuf89pdsuf89sauf8d9sauf89dsuf89pdsauf',
  );
  expect(descriptionInput.textContent).toEqual('testDescription');
});

test('alerts user when description is empty, maintains form', async () => {
  server.use(...newPollNoDescriptionHandler);
  const user = userEvent.setup();

  render(
    <>
      <Toaster />
      <NewPoll />
    </>,
  );

  const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
  await user.type(nameInput, 'testName');

  const submitButton = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitButton);

  const errorToast = await screen.findByText(/Description must be provided./i);
  expect(errorToast).toBeDefined();

  // Ensure the form is not cleared since the submission failed
  expect(nameInput.value).toBe('testName');
});

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
