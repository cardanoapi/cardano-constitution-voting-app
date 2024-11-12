import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import { Workshop } from '@/types';

/**
 * Fetches all workshops from the database
 * @returns Workshop[] - The Workshops
 */
export async function getWorkshops(): Promise<Workshop[]> {
  try {
    const response = await axios.get('/api/getWorkshops', {
      headers: { 'X-Custom-Header': 'intersect' },
    });

    if (response.status === 200) {
      const workshops = await response.data;
      return workshops;
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
