import Representative from '@/pages/representatives/[userId]';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { expect, test } from 'vitest';

test('Shows Representative information on view representative page', async () => {
  render(
    <SessionProvider
      session={{
        expires: '1',
        user: {
          id: '1',
          stakeAddress: 'stakeAddress',
          walletName: 'walletName',
        },
      }}
    >
      <Representative />
    </SessionProvider>,
  );
  expect(await screen.findAllByText('John Johnson')).toBeDefined();
  expect(await screen.findAllByText('Delegate')).toBeDefined();
  expect(await screen.findAllByText('Austin, TX')).toBeDefined();
});
