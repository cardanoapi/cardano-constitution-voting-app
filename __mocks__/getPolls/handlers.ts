import { http, HttpResponse } from 'msw';

export const getPollHandlers = [
  http.get('/api/getPolls', () => {
    return HttpResponse.json({
      user: 'John Doe',
    });
  }),
];
