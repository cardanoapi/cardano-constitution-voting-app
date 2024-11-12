import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { User } from '@/types';

/**
 * Fetches all delegates and alternates from the database
 * @returns users: User[] - The delegates & alternates
 */
export async function getRepresentatives(): Promise<User[]> {
  try {
    const response = await axios.get('/api/getRepresentatives', {
      headers: { 'X-Custom-Header': 'intersect' },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      return [];
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return [];
    } else {
      return [];
    }
  }
}
