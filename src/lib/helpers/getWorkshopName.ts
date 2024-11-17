import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Get's the name of a workshop by id
 * @param workshopId - The workshop's id
 * @returns Name - The workshop's name
 */
export async function getWorkshopName(workshopId: string): Promise<{
  name: string;
  message: string;
}> {
  try {
    if (workshopId && typeof workshopId === 'string') {
      const response = await axios.get(`/api/getWorkshopName/${workshopId}`, {
        headers: {
          'X-Custom-Header': 'intersect',
        },
      });
      const data = await response.data;
      if (response.status === 200) {
        if (data.name) {
          return { name: data.name, message: 'Name found' };
        } else {
          return { name: '', message: data.message };
        }
      } else {
        return { name: '', message: data.message };
      }
    } else {
      return { name: '', message: 'Invalid workshopId' };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { name: '', message: error.response.data.message };
    } else {
      return {
        name: '',
        message: 'An error occurred retrieving workshop name',
      };
    }
  }
}
