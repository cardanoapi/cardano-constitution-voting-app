import { http, HttpResponse } from 'msw';

export const updateUserHandlers = [
  http.post('/api/updateUser', () => {
    return HttpResponse.json(
      {
        userId: BigInt(1).toString(),
        message: 'User info updated',
      },
      {
        status: 200,
      },
    );
  }),
];
