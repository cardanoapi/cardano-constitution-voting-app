import NewPoll from '@/pages/polls/new';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders the form with name and description inputs', () => {
  render(<NewPoll />);

  // Check if the form elements are rendered
  expect(screen.getByLabelText(/Name/i)).toBeDefined();
  expect(screen.getByLabelText(/Description/i)).toBeDefined();
  expect(screen.getByRole('button', { name: /Submit/i })).toBeDefined();
});
