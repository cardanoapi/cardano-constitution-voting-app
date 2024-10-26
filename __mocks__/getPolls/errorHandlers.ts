import { http, HttpResponse } from 'msw';

export const getPollsErrorHandlers = [
  http.get('/api/getPolls', () => {
    return HttpResponse.json([], { status: 404 });
  }),
];
