import { http, HttpResponse } from 'msw';

export const newPollVoteHandlers = [
  http.post('/api/newPollVote', () => {
    return HttpResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  }),
];
