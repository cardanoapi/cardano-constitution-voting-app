import { http, HttpResponse } from 'msw';

// No polls found
export const getWorkshopsErrorHandlers = [
  http.get('/api/getWorkshops', () => {
    return HttpResponse.json([], { status: 500 });
  }),
];
