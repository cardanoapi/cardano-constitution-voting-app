import { expect, test } from 'vitest';

import { calculateWinner } from '@/lib/helpers/calculateWinner';

test('empty votes not approved', async () => {
  const votes = {
    yes: [],
    no: [],
    abstain: [],
  };
  const winner = calculateWinner(votes);
  expect(winner).toBe('no');
});
