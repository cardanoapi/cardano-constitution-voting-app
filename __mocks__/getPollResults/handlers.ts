import { http, HttpResponse } from 'msw';

export const getPollResultsHandlers = [
  http.get('/api/getPollResults/*', () => {
    return HttpResponse.json({
      votes: {
        yes: [
          {
            name: 'John Johnson',
            id: '1',
          },
          {
            name: 'Mike Mickelson',
            id: '2',
          },
          {
            name: 'Jack Jackson',
            id: '3',
          },
          {
            name: 'Rob Robertson',
            id: '4',
          },
        ],
        no: [],
        abstain: [
          {
            name: 'Connor Connerson',
            id: '5',
          },
        ],
      },
      message: 'Poll vote count retrieved',
    });
  }),
];
