import { http, HttpResponse } from 'msw';

// No users found
export const getRepresentatativesErrorHandlers = [
  http.get('/api/getRepresentatives', () => {
    return HttpResponse.json([], { status: 500 });
  }),
];
