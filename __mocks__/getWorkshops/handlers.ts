import { http, HttpResponse } from 'msw';

export const getWorkshopsHandlers = [
  http.get('/api/getWorkshops', () => {
    return HttpResponse.json([
      {
        id: BigInt(1).toString(),
        name: 'Austin, TX',
        delegate_id: BigInt(1).toString(),
        alternate_id: BigInt(2).toString(),
        active_voter_id: BigInt(1).toString(),
      },
      {
        id: BigInt(2).toString(),
        name: 'Chicago, IL',
        delegate_id: BigInt(3).toString(),
        alternate_id: BigInt(4).toString(),
        active_voter_id: BigInt(3).toString(),
      },
      {
        id: BigInt(3).toString(),
        name: 'New York, NY',
        delegate_id: BigInt(5).toString(),
        alternate_id: BigInt(6).toString(),
        active_voter_id: BigInt(5).toString(),
      },
    ]);
  }),
];
