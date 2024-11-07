import { deletePollHandlers } from '@/../__mocks__/deletePoll/handlers';
import { endVotingHandlers } from '@/../__mocks__/endVoting/handlers';
import { getPollHandlers } from '@/../__mocks__/getPoll/handlers';
import { getPollResultsHandlers } from '@/../__mocks__/getPollResults/handlers';
import { getPollsHandlers } from '@/../__mocks__/getPolls/handlers';
import { getPollVoteCountHandlers } from '@/../__mocks__/getPollVoteCount/handlers';
import { getRepresentativesHandlers } from '@/../__mocks__/getRepresentatives/handlers';
import { getUserHandlers } from '@/../__mocks__/getUser/handlers';
import { getUserVotesHandlers } from '@/../__mocks__/getUserVotes/handlers';
import { getWorkshopNameHandlers } from '@/../__mocks__/getWorkshopName/handlers';
import { getWorkshopsHandlers } from '@/../__mocks__/getWorkshops/handlers';
import { newPollHandlers } from '@/../__mocks__/newPoll/handlers';
import { newPollVoteHandlers } from '@/../__mocks__/newPollVote/handlers';
import { startVotingHandlers } from '@/../__mocks__/startVoting/handlers';
import { updateActiveVoterHandlers } from '@/../__mocks__/updateActiveVoter/handlers';
import { updateUserHandlers } from '@/../__mocks__/updateUser/handlers';
import { setupServer } from 'msw/node';

export const server = setupServer(
  ...newPollHandlers,
  ...getPollsHandlers,
  ...startVotingHandlers,
  ...endVotingHandlers,
  ...newPollVoteHandlers,
  ...getPollHandlers,
  ...getPollVoteCountHandlers,
  ...getUserHandlers,
  ...getUserVotesHandlers,
  ...getWorkshopNameHandlers,
  ...getWorkshopsHandlers,
  ...getRepresentativesHandlers,
  ...getPollResultsHandlers,
  ...updateActiveVoterHandlers,
  ...updateUserHandlers,
  ...deletePollHandlers,
);
