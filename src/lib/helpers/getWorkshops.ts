import { Workshop } from '@/types';

/**
 * Fetches all workshops from the database
 * @returns Workshop[] - The Workshops
 */
export async function getWorkshops(): Promise<Workshop[]> {
  const response = await fetch('/api/getWorkshops', {
    headers: { 'X-Custom-Header': 'intersect' },
  });

  if (response.status === 200) {
    const workshops = await response.json();
    return workshops;
  } else {
    return [];
  }
}
