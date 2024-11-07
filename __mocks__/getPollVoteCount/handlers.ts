import { http, HttpResponse } from 'msw';

export const getPollVoteCount1Handlers = [
  http.get('/api/getPollVoteCount/*', () => {
    return HttpResponse.json({
      count: 1,
      message: 'Poll vote count retrieved',
    });
  }),
];

export const getPollVoteCount0Handlers = [
  http.get('/api/getPollVoteCount/*', () => {
    return HttpResponse.json({
      count: 0,
      message: 'Poll vote count retrieved',
    });
  }),
];

export const getPollVoteCount60Handlers = [
  http.get('/api/getPollVoteCount/*', () => {
    return HttpResponse.json({
      count: 60,
      message: 'Poll vote count retrieved',
    });
  }),
];

export const getPollVoteCountNegative2Handlers = [
  http.get('/api/getPollVoteCount/*', () => {
    return HttpResponse.json({
      count: -2,
      message: 'Poll vote count retrieved',
    });
  }),
];
