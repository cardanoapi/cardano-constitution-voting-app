/**
 * Get's the name of a workshop by id
 * @param workshopId - The workshop's id
 * @returns Name - The workshop's name
 */
export async function getWorkshopName(workshopId: string): Promise<{
  name: string;
  message: string;
}> {
  let response: Response;
  if (workshopId && typeof workshopId === 'string') {
    response = await fetch(`/api/getWorkshopName/${workshopId}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'intersect',
      },
    });
    const data = await response.json();
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
}
