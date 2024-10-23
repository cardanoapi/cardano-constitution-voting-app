import '@testing-library/jest-dom';

import { getUserErrorHandlers } from '@/../__mocks__/getUser/errorHandlers';
import { server } from '@/../__mocks__/server';
import Home from '@/pages/index';
import { render, screen } from '@testing-library/react';

describe('Home', () => {
  it("successfully shows user's name", async () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();

    const name = await screen.findByRole('heading', {
      level: 2,
      name: 'John Doe',
    });

    expect(name).toBeInTheDocument();
  });
});

describe('Home', () => {
  it('shows error message if user could not be found', async () => {
    server.use(...getUserErrorHandlers);
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();

    const name = await screen.findByRole('heading', {
      level: 2,
      name: 'Could not find user',
    });

    expect(name).toBeInTheDocument();
  });
});
