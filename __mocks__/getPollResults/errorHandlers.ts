import { http, HttpResponse } from 'msw';

export const getPollResultsInvalidIdHandler = [
  http.get('/api/getPollResults/*', () => {
    return HttpResponse.json(
      {
        votes: null,
        message: 'Invalid pollId',
      },
      { status: 400 },
    );
  }),
];

export const getPollResultsInternalErrorHandler = [
  http.get('/api/getPollResults/*', () => {
    return HttpResponse.json(
      {
        votes: null,
        message: 'Error getting Poll Vote Count.',
      },
      { status: 500 },
    );
  }),
];
