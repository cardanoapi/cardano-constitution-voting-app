import { User } from '@/types';

/**
 * Get's the name of a workshop by id
 * @param workshopId - The workshop's id
 * @returns Name - The workshop's name
 */
export async function getWorkshopName(workshopId: string): Promise<string> {
  let response: Response;
  if (workshopId && typeof workshopId === 'string') {
    response = await fetch(`/api/getWorkshopName/${workshopId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data.name) {
        return data.name;
      } else {
        return '';
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
}
