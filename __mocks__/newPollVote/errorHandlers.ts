import { http, HttpResponse } from 'msw';

export const newPollVoteNoIdHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll Id must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const newPollVoteNoVoteHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Vote option must be provided.',
      },
      { status: 400 },
    );
  }),
];

export const newPollVoteInvalidVoteHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Vote option must be yes, no, or abstain.',
      },
      { status: 400 },
    );
  }),
];

export const newPollVotePollNotFoundHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll not found',
      },
      { status: 404 },
    );
  }),
];

export const newPollVoteNotVotingHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll is not voting',
      },
      { status: 400 },
    );
  }),
];

export const pollIsArchivedHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Poll is archived',
      },
      { status: 400 },
    );
  }),
];

export const newPollVoteInternalErrorHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Error voting on Poll.',
      },
      { status: 500 },
    );
  }),
];

export const newPollVoteInvalidSignatureHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid signature.',
      },
      { status: 401 },
    );
  }),
];

export const newPollVoteUserNotFoundHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'User not found.',
      },
      { status: 401 },
    );
  }),
];

export const newPollVoteUserNotRepresentativeHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'You must be a Representative to vote.',
      },
      { status: 401 },
    );
  }),
];

export const newPollVoteWorkshopNotFoundHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'Workshop not found.',
      },
      { status: 401 },
    );
  }),
];

export const newPollVoteNotActiveVoterHandler = [
  http.post('/api/newPollVote', async () => {
    return HttpResponse.json(
      {
        success: false,
        message: 'User is not the active voter for Sydney, Australia workshop.',
      },
      { status: 401 },
    );
  }),
];
