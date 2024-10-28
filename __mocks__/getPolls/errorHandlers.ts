import { http, HttpResponse } from 'msw';

// No polls found
export const getPollsErrorHandlers = [
  http.get('/api/getPolls', () => {
    return HttpResponse.json([], { status: 404 });
  }),
];
