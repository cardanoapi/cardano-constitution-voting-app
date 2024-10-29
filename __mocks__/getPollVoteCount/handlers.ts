import { http, HttpResponse } from 'msw';

export const getPollVoteCountHandler = [
  http.get('/api/getPollVoteCount/*', () => {
    return HttpResponse.json({
      count: 1,
    });
  }),
];
