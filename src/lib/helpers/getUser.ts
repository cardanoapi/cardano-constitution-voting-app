import { User } from '@claritydao/clarity-backend';

export async function getUser(stakeAddress: string): Promise<User | null> {
  let response: Response;
  if (stakeAddress) {
    response = await fetch(`/api/getUser/${stakeAddress}`, {
      method: 'GET',
      headers: {
        'X-Custom-Header': 'reindeer',
      },
    });
    if (response.status === 200) {
      const user = await response.json();
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
