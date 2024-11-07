import { http, HttpResponse } from 'msw';

export const updateActiveVoterHandlers = [
  http.post('/api/updateActiveVoter', () => {
    return HttpResponse.json(
      {
        userId: BigInt(1).toString(),
        message: 'Active voter updated',
      },
      {
        status: 200,
      },
    );
  }),
];
