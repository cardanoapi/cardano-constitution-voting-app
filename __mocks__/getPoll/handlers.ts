import { http, HttpResponse } from 'msw';

export const getPollHandler = [
  http.get('/api/getPoll/*', () => {
    return HttpResponse.json({
      id: BigInt(1).toString(),
      name: 'Poll #1',
      description: 'This is Poll #1',
      status: 'pending',
      summary_tx_id: null,
    });
  }),
];
