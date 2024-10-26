import { http, HttpResponse } from 'msw';

export const getPollsErrorHandlers = [
  http.get('/api/getPolls', () => {
    return HttpResponse.json(
      {
        user: 'Could not find user',
      },
      { status: 404 },
    );
  }),
];
