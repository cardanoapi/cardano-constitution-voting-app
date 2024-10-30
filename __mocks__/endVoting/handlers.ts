import { http, HttpResponse } from 'msw';

export const endVotingHandlers = [
  http.post('/api/endVoting', () => {
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
