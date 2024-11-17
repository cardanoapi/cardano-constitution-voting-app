import { http, HttpResponse } from 'msw';

// TODO: Figure out how to properly mock the blob response
export const downloadUserVotesHandlers = [
  http.post('/api/downloadUserVotes', () => {
    return HttpResponse.json({
      status: 200,
    });
  }),
];
