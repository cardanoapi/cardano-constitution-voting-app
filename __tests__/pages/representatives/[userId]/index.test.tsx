import {
  getUserInternalErrorHandler,
  getUserInvalidMethodHandler,
  getUserInvalidUserIdHandler,
  getUserNotFoundHandler,
} from '@/../__mocks__/getUser/errorHandlers';
import { server } from '@/../__mocks__/server';
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

test('Alerts user when method not allowed on view representative page', async () => {
  server.use(...getUserInvalidMethodHandler);
});

test('Alerts user when User not found on view representative page', async () => {
  server.use(...getUserInvalidUserIdHandler);
});

test('Alerts user when Invalid query userId on view representative page', async () => {
  server.use(...getUserNotFoundHandler);
});

test('Alerts user when internal error fetching user on view representative page', async () => {
  server.use(...getUserInternalErrorHandler);
});
