import { http, HttpResponse } from 'msw';

export const getRepresentativesHandler = [
  http.get('/api/getRepresentatives', () => {
    return HttpResponse.json([
      {
        id: BigInt(1).toString(),
        is_convention_organizer: false,
        is_delegate: true,
        is_alternate: false,
        workshop_id: BigInt(1).toString(),
        email: 'john@johnson.com',
        color: '#000000',
        wallet_address: 'addr1isdufnpoasidjfopmaimdfmopisadj',
        name: 'John Johnson',
      },
      {
        id: BigInt(2).toString(),
        is_convention_organizer: false,
        is_delegate: false,
        is_alternate: true,
        workshop_id: BigInt(1).toString(),
        email: 'mike@mickelson.com',
        color: '#000000',
        wallet_address: 'addr1oqwieuroijfvaondsfipoaapoidjf',
        name: 'Mike Mickelson',
      },
      {
        id: BigInt(3).toString(),
        is_convention_organizer: false,
        is_delegate: true,
        is_alternate: false,
        workshop_id: BigInt(2).toString(),
        email: 'jack@jackson.com',
        color: '#000000',
        wallet_address: 'addr1kidjfsadjfoadspjfoaidsfadsop',
        name: 'Jack Jackson',
      },
    ]);
  }),
];
