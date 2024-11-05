import { http, HttpResponse } from 'msw';

export const updateActiveVoterNoWorkshopIdHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: '-1',
        message: 'Workshop id must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const updateActiveVoterNoVoterIdHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Active Voter id must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const updateActiveVoterWorkshopNotFoundHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Workshop not found',
      },
      { status: 404 },
    );
  }),
];

export const updateActiveVoterInvalidVoterHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message:
          'Active voter id must be a delegate or alternate for this workshop.',
      },
      { status: 400 },
    );
  }),
];

export const updateActiveVoterInternalErrorHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'Error updating active voter.',
      },
      { status: 500 },
    );
  }),
];

export const updateActiveVoterInvalidSessionHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'You must be signed in as an Organizer update active voter.',
      },
      { status: 401 },
    );
  }),
];

export const updateActiveVoterNotOrganizerHandler = [
  http.post('/api/updateActiveVoter', async () => {
    return HttpResponse.json(
      {
        userId: BigInt(-1).toString(),
        message: 'You must be an Organizer to update active voter.',
      },
      { status: 401 },
    );
  }),
];
