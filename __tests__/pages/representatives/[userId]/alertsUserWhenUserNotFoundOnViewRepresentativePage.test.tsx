import { getUserInvalidUserIdHandler } from '@/../__mocks__/getUser/errorHandlers';
import { server } from '@/../__mocks__/server';
import { test } from 'vitest';

test('Alerts user when User not found on view representative page', async () => {
  server.use(...getUserInvalidUserIdHandler);
});
