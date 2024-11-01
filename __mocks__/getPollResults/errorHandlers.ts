import { http, HttpResponse } from 'msw';

export const getPollVoteCountInvalidIdHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        votes: null,
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
        votes: null,
        message: 'Error getting Poll Vote Count.',
      },
      { status: 500 },
    );
  }),
];
