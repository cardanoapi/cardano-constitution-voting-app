import { getPollsHandlers } from '@/../__mocks__/getPolls/handlers';
import { newPollHandlers } from '@/../__mocks__/newPoll/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(...newPollHandlers, ...getPollsHandlers);
