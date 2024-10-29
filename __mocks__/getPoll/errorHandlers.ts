import { http, HttpResponse } from 'msw';

export const getPollInvalidIdHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        message: 'Invalid pollId',
      },
      { status: 400 },
    );
  }),
];

export const getPollNotFoundHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        message: 'Poll not found',
      },
      { status: 404 },
    );
  }),
];

export const getPollInternalErrorHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        message: 'Error getting Poll.',
      },
      { status: 500 },
    );
  }),
];
