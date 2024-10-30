import { endVotingHandlers } from '@/../__mocks__/endVoting/handlers';
import { getPollHandlers } from '@/../__mocks__/getPoll/handlers';
import { getPollsHandlers } from '@/../__mocks__/getPolls/handlers';
import { getPollVoteCountHandlers } from '@/../__mocks__/getPollVoteCount/handlers';
import { getUserHandlers } from '@/../__mocks__/getUser/handlers';
import { newPollHandlers } from '@/../__mocks__/newPoll/handlers';
import { newPollVoteHandlers } from '@/../__mocks__/newPollVote/handlers';
import { startVotingHandlers } from '@/../__mocks__/startVoting/handlers';
import { setupServer } from 'msw/node';

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
