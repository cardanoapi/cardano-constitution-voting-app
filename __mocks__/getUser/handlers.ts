import { http, HttpResponse } from 'msw';

export const getUserHandlers = [
  http.get('/api/getUser', () => {
    return HttpResponse.json({
      user: 'John Doe',
    });
  }),
];
