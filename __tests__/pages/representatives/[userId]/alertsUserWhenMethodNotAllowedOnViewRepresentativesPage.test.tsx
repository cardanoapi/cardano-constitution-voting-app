import { getUserInvalidMethodHandler } from '@/../__mocks__/getUser/errorHandlers';
import { server } from '@/../__mocks__/server';
import { test } from 'vitest';

test('Alerts user when method not allowed on view representative page', async () => {
  server.use(...getUserInvalidMethodHandler);
});
