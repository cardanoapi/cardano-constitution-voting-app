import { getPollsHandlers } from '@/../__mocks__/getPolls/handlers';
import { getUserHandlers } from '@/../__mocks__/getUser/handlers';
import { newPollHandlers } from '@/../__mocks__/newPoll/handlers';
import { setupServer } from 'msw/node';

import { endVotingHandlers } from './endVoting/handlers';
import { getPollHandlers } from './getPoll/handlers';
import { getPollVoteCountHandlers } from './getPollVoteCount/handlers';
import { newPollVoteHandlers } from './newPollVote/handlers';
import { startVotingHandlers } from './startVoting/handlers';

export const server = setupServer(
  ...getUserHandlers,
  ...newPollHandlers,
  ...getPollsHandlers,
  ...startVotingHandlers,
  ...endVotingHandlers,
  ...newPollVoteHandlers,
  ...getPollHandlers,
  ...getPollVoteCountHandlers,
);
