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

describe('NewPoll Component', () => {
  it('renders the form with name and description inputs', () => {
    render(<NewPoll />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('clears new poll form after creation', async () => {
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
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
  });

  it('redirects to created poll after creation', async () => {
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

    await waitFor(() => {
      expect(mockRouter).toMatchObject({
        asPath: '/polls/1',
      });
    });
  });

  it('alerts user when name is empty, maintains form', async () => {
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
    await waitFor(() => {
      expect(screen.getByText(/Name must be provided./i)).toBeInTheDocument();
    });

    // Ensure the form is not cleared since the submission failed
    expect(screen.getByLabelText('Description')).toHaveValue('testDescription');
  });

  it('alerts user when name is longer than 255 characters, maintains form', async () => {
    server.use(...newPollTooLongNameHandler);
    const user = userEvent.setup();

    render(
      <>
        <Toaster />
        <NewPoll />
      </>,
    );

    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'testName');

    const descriptionInput = screen.getByLabelText('Description');
    await user.type(descriptionInput, 'testDescription');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    // Wait for the error toast to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Name must be less than 255 characters./i),
      ).toBeInTheDocument();
    });

    // Ensure the form is not cleared since the submission failed
    expect(screen.getByLabelText('Name')).toHaveValue('testName');
    expect(screen.getByLabelText('Description')).toHaveValue('testDescription');
  });

  it('alerts user when description is empty, maintains form', async () => {
    server.use(...newPollNoDescriptionHandler);
    const user = userEvent.setup();

    render(
      <>
        <Toaster />
        <NewPoll />
      </>,
    );

    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'testName');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    const errorToast = await screen.findByText(
      /Description must be provided./i,
    );
    expect(errorToast).toBeInTheDocument();

    // Ensure the form is not cleared since the submission failed
    expect(screen.getByLabelText('Name')).toHaveValue('testName');
  });

  it('alerts user when description is longer than 10,000 characters, maintains form', async () => {
    server.use(...newPollTooLongDescriptionHandler);
    const user = userEvent.setup();

    render(
      <>
        <Toaster />
        <NewPoll />
      </>,
    );

    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'testName');

    const descriptionInput = screen.getByLabelText('Description');
    await user.type(descriptionInput, 'testDescription');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    const errorToast = await screen.findByText(
      /Description must be less than 10,000 characters./i,
    );
    expect(errorToast).toBeInTheDocument();

    // Ensure the form is not cleared since the submission failed
    expect(screen.getByLabelText('Name')).toHaveValue('testName');
    expect(screen.getByLabelText('Description')).toHaveValue('testDescription');
  });
});
