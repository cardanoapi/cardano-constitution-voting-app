import { http, HttpResponse } from 'msw';

export const getUserHandlers = [
  http.get('/api/getUser/*', () => {
    return HttpResponse.json({
      user: {
        id: BigInt(1).toString(),
        is_convention_organizer: false,
        is_delegate: true,
        is_alternate: false,
        workshop_id: BigInt(1).toString(),
        email: 'john@johnson.com',
        color: '#000000',
        wallet_address: 'addr1kidjfsadjfoadspjfoaidsfadsop',
        name: 'John Johnson',
      },
      message: 'Found user',
    });
  }),
];
