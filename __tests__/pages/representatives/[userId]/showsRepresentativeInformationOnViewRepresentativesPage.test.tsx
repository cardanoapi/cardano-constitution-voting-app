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
          isCoordinator: false,
          isDelegate: true,
          isAlternate: false,
        },
      }}
    >
      <Representative
        user={{
          id: '1',
          is_convention_organizer: false,
          is_delegate: true,
          is_alternate: false,
          workshop_id: '1',
          name: 'Test User',
          email: 'email@email.com',
          wallet_address: 'stake1234',
        }}
        userVotes={[]} // Not important for this test
        representatives={[]} // Not important for this test
        workshops={[]} // Not important for this test
        workshopName="Austin, TX" // Not important for this test
        polls={[]} // Not important for this test
        isActiveVoter={true} // Not important for this test
      />
    </SessionProvider>,
  );
  expect(await screen.findAllByText('Test User')).toBeDefined();
  expect(await screen.findAllByText('Delegate')).toBeDefined();
  expect(await screen.findAllByText('Austin, TX')).toBeDefined();
  expect(await screen.findByText('stake1234')).toBeDefined();
});
