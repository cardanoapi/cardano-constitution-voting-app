import { getRepresentatativesErrorHandlers } from '@/../__mocks__/getRepresentatives/errorHandlers';
import { server } from '@/../__mocks__/server';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { RepresentativesTable } from '@/components/representatives/representativesTable';

test('shows no representatives found message', async () => {
  server.use(...getRepresentatativesErrorHandlers);
  render(<RepresentativesTable />);
  expect(await screen.findByText('No Representatives found.')).toBeDefined();
});
