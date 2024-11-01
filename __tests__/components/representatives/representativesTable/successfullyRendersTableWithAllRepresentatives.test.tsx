import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { RepresentativesTable } from '@/components/representatives/representativesTable';

test('successfully renders table with all representatives', async () => {
  render(<RepresentativesTable />);
  expect(await screen.findByText('Representatives')).toBeDefined();
  // user 1 -- use find all by text because he will show up 2 times in this table since he is the active voter
  expect(await screen.findAllByText('John Johnson')).toBeDefined();
  // user 2
  expect(await screen.findByText('Mike Mickelson')).toBeDefined();
  // user 3 -- use find all by text because he will show up 2 times in this table since he is the active voter
  expect(await screen.findAllByText('Jack Jackson')).toBeDefined();
  // user 4
  expect(await screen.findByText('Robert Robertson')).toBeDefined();
  // user 5 -- use find all by text because he will show up 2 times in this table since he is the active voter
  expect(await screen.findAllByText('Connor Connorson')).toBeDefined();
  // user 6
  expect(await screen.findByText('Kyle Kyleson')).toBeDefined();
});
