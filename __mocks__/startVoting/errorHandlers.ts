import { http, HttpResponse } from 'msw';

export const startVotingNotFoundHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll not found',
      },
      { status: 404 },
    );
  }),
];

export const startVotingNotPendingHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll is not pending',
      },
      { status: 400 },
    );
  }),
];

export const startVotingInternalErrorHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Error starting voting for Poll.',
      },
      { status: 500 },
    );
  }),
];

export const startVotingInvalidSessionHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'You must be signed in as an Organizer to start voting.',
      },
      { status: 401 },
    );
  }),
];

export const startVotingNotOrganizerHandler = [
  http.post('/api/startVoting', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'You must be an Organizer to start voting.',
      },
      { status: 401 },
    );
  }),
];
