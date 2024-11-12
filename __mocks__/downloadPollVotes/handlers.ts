import { http, HttpResponse } from 'msw';

export const downloadPollVotesHandlers = [
  http.post('/api/downloadPollVotes', () => {
    return HttpResponse.json({
      status: 200,
    });
  }),
];
