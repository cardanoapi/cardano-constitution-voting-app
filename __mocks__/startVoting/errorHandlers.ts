import { http, HttpResponse } from 'msw';

export const startVotingNotFoundHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll not found',
      },
      { status: 404 },
    );
  }),
];

export const startVotingNotVotingHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll is not pending',
      },
      { status: 400 },
    );
  }),
];

export const startVotingInternalErrorHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Error starting voting for Poll.',
      },
      { status: 500 },
    );
  }),
];
