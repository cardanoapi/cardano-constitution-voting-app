import { getUserHandlers } from '@/../__mocks__/getUser/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...getUserHandlers);
