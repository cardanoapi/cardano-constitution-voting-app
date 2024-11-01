import { http, HttpResponse } from 'msw';

export const getWorkshopNameInvalidMethodHandler = [
  http.get('/api/getWorkshopName/*', () => {
    return HttpResponse.json(
      {
        name: '',
        message: 'Method not allowed',
      },
      { status: 405 },
    );
  }),
];

export const getWorkshopNameInvalidWorkshopIdHandler = [
  http.get('/api/getWorkshopName/*', () => {
    return HttpResponse.json(
      { name: '', message: 'Invalid query workshopId' },
      { status: 400 },
    );
  }),
];

export const getWorkshopNameNotFoundHandler = [
  http.get('/api/getWorkshopName/*', () => {
    return HttpResponse.json(
      { uname: '', message: 'Workshop not found' },
      { status: 404 },
    );
  }),
];

export const getWorkshopNameInternalErrorHandler = [
  http.get('/api/getWorkshopName/*', () => {
    return HttpResponse.json(
      { name: '', message: 'Error fetching user' },
      { status: 500 },
    );
  }),
];
