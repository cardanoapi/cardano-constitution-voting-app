import { http, HttpResponse } from 'msw';

export const newPollHandlers = [
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
