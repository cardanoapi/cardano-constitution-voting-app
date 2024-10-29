import { http, HttpResponse } from 'msw';

export const newPollVoteNoIdHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll Id must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const newPollVoteNoVoteHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Vote option must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const newPollVoteInvalidVoteHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Vote option must be yes, no, or abstain.',
      },
      { status: 400 },
    );
  }),
];

export const newPollVotePollNotFoundHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll not found',
      },
      { status: 404 },
    );
  }),
];

export const newPollVoteNotVotingHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll is not voting',
      },
      { status: 400 },
    );
  }),
];
