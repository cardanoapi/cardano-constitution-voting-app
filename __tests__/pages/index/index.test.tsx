import '@testing-library/jest-dom';

import Home from '@/pages/index';
import { render, screen } from '@testing-library/react';

describe('Home', () => {
  it('renders a heading', async () => {
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
