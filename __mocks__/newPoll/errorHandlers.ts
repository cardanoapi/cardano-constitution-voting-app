import { http, HttpResponse } from 'msw';

export const newPollNoNameHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        pollId: BigInt(-1).toString(),
        message: 'Name must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const newPollNoDescriptionHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        pollId: BigInt(-1).toString(),
        message: 'Description must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const newPollTooLongNameHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        pollId: BigInt(-1).toString(),
        message: 'Name must be less than 255 characters.',
      },
      { status: 400 },
    );
  }),
];

export const newPollTooLongDescriptionHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        pollId: BigInt(-1).toString(),
        message: 'Description must be less than 10,000 characters.',
      },
      { status: 400 },
    );
  }),
];

export const newPollInternalErrorHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        pollId: BigInt(-1).toString(),
        message: 'Error creating new Poll.',
      },
      { status: 500 },
    );
  }),
];

export const newPollInvalidSessionHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'You must be signed in as an Organizer create a poll.',
      },
      { status: 401 },
    );
  }),
];

export const newPollNotOrganizerHandler = [
  http.post('/api/newPoll', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'You must be an Organizer to create a poll.',
      },
      { status: 401 },
    );
  }),
];
