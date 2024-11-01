import { http, HttpResponse } from 'msw';

// No polls found
export const getPollsErrorHandlers = [
  http.get('/api/getWorkshops', () => {
    return HttpResponse.json([], { status: 500 });
  }),
];
