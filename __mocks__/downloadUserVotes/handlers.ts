import { http, HttpResponse } from 'msw';

export const downloadUserVotesHandlers = [
  http.post('/api/downloadUserVotes', () => {
    return HttpResponse.json({
      status: 200,
    });
  }),
];
