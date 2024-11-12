import { http, HttpResponse } from 'msw';

export const downloadUserVotesPollIdNotValidHandler = [
  http.post('/api/downloadUserVotes', async () => {
    return HttpResponse.json(
      { success: false, message: 'Missing userId' },
      { status: 400 },
    );
  }),
];

export const downloadUserVotesInternalErrorHandler = [
  http.post('/api/downloadUserVotes', async () => {
    return HttpResponse.json(
      { success: false, message: 'Failed to create CSV file' },
      { status: 500 },
    );
  }),
];
