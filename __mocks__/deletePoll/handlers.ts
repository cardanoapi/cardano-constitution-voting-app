import { http, HttpResponse } from 'msw';

export const deletePollHandlers = [
  http.delete('/api/deletePoll/*', () => {
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
