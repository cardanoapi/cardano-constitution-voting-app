import { http, HttpResponse } from 'msw';

export const getPollVoteCountInvalidIdHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json(
      {
        count: 0,
        message: 'Invalid pollId',
      },
      { status: 400 },
    );
  }),
];
