import { http, HttpResponse } from 'msw';

export const endVotingNotFoundHandler = [
  http.post('/api/endVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll not found',
      },
      { status: 404 },
    );
  }),
];

export const endVotingNotVotingHandler = [
  http.post('/api/endVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll is not voting',
      },
      { status: 400 },
    );
  }),
];

export const endVotingInternalErrorHandler = [
  http.post('/api/endVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Error ending voting for Poll.',
      },
      { status: 500 },
    );
  }),
];
