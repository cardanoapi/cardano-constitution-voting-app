import { getUserHandlers } from '@/../__mocks__/getUser/handlers';
import { newPollHandlers } from '@/../__mocks__/newPoll/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...getUserHandlers, ...newPollHandlers);
