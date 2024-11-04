import { http, HttpResponse } from 'msw';

export const getPollVoteCountInvalidIdHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        count: 0,
        message: 'Invalid pollId',
      },
      { status: 400 },
    );
  }),
];

export const getPollVoteCountInternalErrorHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        count: 0,
        message: 'Error getting Poll Vote Count.',
      },
      { status: 500 },
    );
  }),
];
