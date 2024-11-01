import { http, HttpResponse } from 'msw';

export const getUserVotesInvalidMethodHandler = [
  http.get('/api/getUserVotes/*', () => {
    return HttpResponse.json(
      {
        user: null,
        message: 'Method not allowed',
      },
      { status: 405 },
    );
  }),
];

export const getUserVotesInvalidUserIdHandler = [
  http.get('/api/getUserVotes/*', () => {
    return HttpResponse.json(
      { user: null, message: 'Invalid query userId' },
      { status: 400 },
    );
  }),
];

export const getUserVotesNotFoundHandler = [
  http.get('/api/getUserVotes/*', () => {
    return HttpResponse.json(
      { user: null, message: 'Votes not found' },
      { status: 404 },
    );
  }),
];

export const getUserVotesInternalErrorHandler = [
  http.get('/api/getUserVotes/*', () => {
    return HttpResponse.json(
      { user: null, message: 'Error fetching user votes' },
      { status: 500 },
    );
  }),
];
