import { http, HttpResponse } from 'msw';

export const getUserInvalidMethodHandler = [
  http.get('/api/getUser/*', () => {
    return HttpResponse.json(
      {
        user: null,
        message: 'Method not allowed',
      },
      { status: 405 },
    );
  }),
];

export const getUserInvalidUserIdHandler = [
  http.get('/api/getUser/*', () => {
    return HttpResponse.json(
      { user: null, message: 'Invalid query userId' },
      { status: 400 },
    );
  }),
];

export const getUserNotFoundHandler = [
  http.get('/api/getUser/*', () => {
    return HttpResponse.json(
      { user: null, message: 'User not found' },
      { status: 404 },
    );
  }),
];

export const getUserInternalErrorHandler = [
  http.get('/api/getUser/*', () => {
    return HttpResponse.json(
      { user: null, message: 'Error fetching user' },
      { status: 500 },
    );
  }),
];
