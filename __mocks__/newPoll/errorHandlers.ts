import { http, HttpResponse } from 'msw';

export const newPollErrorHandlers = [
  http.post('/api/newPoll', () => {
    return HttpResponse.json(
      {
        pollId: BigInt(-1).toString(),
      },
      { status: 400 },
    );
  }),
];
