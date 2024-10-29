import { http, HttpResponse } from 'msw';

export const startVotingHandlers = [
  http.post('/api/startVoting', () => {
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
