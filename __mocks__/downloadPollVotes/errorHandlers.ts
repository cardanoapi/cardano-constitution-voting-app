import { http, HttpResponse } from 'msw';

export const downloadPollVotesPollIdNotValidHandler = [
  http.post('/api/downloadPollVotes', async () => {
    return HttpResponse.json(
      { success: false, message: 'Missing pollId' },
      { status: 400 },
    );
  }),
];

export const downloadPollVotesInternalErrorHandler = [
  http.post('/api/downloadPollVotes', async () => {
    return HttpResponse.json(
      { success: false, message: 'Failed to create CSV file' },
      { status: 500 },
    );
  }),
];

export const downloadPollVotesNotConcludedHandler = [
  http.post('/api/downloadPollVotes', async () => {
    return HttpResponse.json(
      { success: false, message: 'Poll is not concluded' },
      { status: 500 },
    );
  }),
];
