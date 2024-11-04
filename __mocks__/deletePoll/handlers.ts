import { http, HttpResponse } from 'msw';

export const deletePollHandlers = [
  http.post('/api/deletePoll', () => {
    return HttpResponse.json(
      {
        succeeded: true,
        message: 'Poll Deleted',
      },
      {
        status: 200,
      },
    );
  }),
];
