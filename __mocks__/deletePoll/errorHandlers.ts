import { http, HttpResponse } from 'msw';

export const deletePollErrorHandlers = [
  http.delete('/api/deletePoll/*', async () => {
    return HttpResponse.json(
      {
        succeeded: false,
        message: 'Error deleting Poll',
      },
      { status: 500 },
    );
  }),
];

export const deletePollInvalidPollIdErrorHandler = [
  http.delete('/api/deletePoll/*', async () => {
    return HttpResponse.json(
      {
        succeeded: false,
        message: 'Invalid pollId',
      },
      { status: 500 },
    );
  }),
];
