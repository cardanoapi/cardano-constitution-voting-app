import { http, HttpResponse } from 'msw';

export const newPollHandlers = [
  http.post('/api/newPoll', () => {
    return HttpResponse.json({
      pollId: BigInt(1).toString(),
    });
  }),
];
