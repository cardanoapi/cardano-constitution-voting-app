import { http, HttpResponse } from 'msw';

export const getPollHandlers = [
  http.get('/api/getPolls', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Poll #1',
        description: 'This is Poll #1',
        status: 'concluded',
        summary_tx_id: null,
      },
      {
        id: '2',
        name: 'Poll #2',
        description: 'A poll that is voting',
        status: 'voting',
        summary_tx_id: null,
      },
      {
        id: '3',
        name: 'Poll #3',
        description: 'A poll that has not started voting yet',
        status: 'pending',
        summary_tx_id: null,
      },
    ]);
  }),
];
