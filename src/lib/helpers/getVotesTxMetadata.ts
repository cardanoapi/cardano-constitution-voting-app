import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

import type { Metadata } from '@/types';

/**
 * Returns metadata for a transaction that uploads poll votes on-chain
 * @returns TX metadata
 */
export async function getVotesTxMetadata(pollId: string): Promise<{
  metadata: Metadata | null;
  message: string;
}> {
  try {
    const response = await axios.get(`/api/getVotesTxMetadata/${pollId}`, {
      headers: { 'X-Custom-Header': 'intersect' },
    });

    const data = (await response.data) as {
      metadata: Metadata | null;
      message: string;
    };
    if (response.status === 200) {
      return { metadata: data.metadata, message: 'Metadata constructed' };
    } else {
      return { metadata: null, message: data.message };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (axios.isAxiosError(error) && error.response) {
      return { metadata: null, message: error.response.data.message };
    } else {
      return { metadata: null, message: 'Failed to construct metadata for TX' };
    }
  }
}
