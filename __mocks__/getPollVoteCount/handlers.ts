import { http, HttpResponse } from 'msw';

export const getPollVoteCountHandlers = [
  http.get('/api/getPollVoteCount/*', () => {
    return HttpResponse.json({
      count: 1,
    });
  }),
];
