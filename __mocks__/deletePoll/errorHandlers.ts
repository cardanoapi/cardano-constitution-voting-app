import { http, HttpResponse } from 'msw';

export const deletePollErrorHandlers = [
  http.post('/api/deletePoll', async () => {
    return HttpResponse.json(
      {
        succeeded: false,
        message: 'Error deleting Poll',
      },
      { status: 500 },
    );
  }),
];
