import { http, HttpResponse } from 'msw';

export const getUserVotesHandlers = [
  http.get('/api/getUserVotes/*', () => {
    return HttpResponse.json({
      votes: [
        {
          poll_id: BigInt(1).toString(),
          user_id: BigInt(1).toString(),
          vote: 'yes',
          signature: Date.now().toString(),
          hashed_message: Date.now().toString(),
        },
        {
          poll_id: BigInt(2).toString(),
          user_id: BigInt(1).toString(),
          vote: 'no',
          signature: Date.now().toString(),
          hashed_message: Date.now().toString(),
        },
        {
          poll_id: BigInt(3).toString(),
          user_id: BigInt(1).toString(),
          vote: 'abstain',
          signature: Date.now().toString(),
          hashed_message: Date.now().toString(),
        },
      ],
      message: 'Found user votes',
    });
  }),
];
