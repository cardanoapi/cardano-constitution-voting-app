import { http, HttpResponse } from 'msw';

export const getWorkshopNameHandlers = [
  http.get('/api/getWorkshopName/*', () => {
    return HttpResponse.json({
      name: 'Austin, TX',
      message: 'Found workshop',
    });
  }),
];
