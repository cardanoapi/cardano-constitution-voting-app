import * as Sentry from '@sentry/nextjs';
import axios from 'axios';

/**
 * Returns metadata for a transaction that uploads the summary TX on-chain
 * @returns TX metadata
 */
export async function getSummaryTxMetadata(pollId: string): Promise<{
  metadata: string[] | null;
  message: string;
}> {
  try {
    const response = await axios.get(`/api/getSummaryTxMetadata/${pollId}`, {
      headers: { 'X-Custom-Header': 'intersect' },
    });

    const data = (await response.data) as {
      metadata: string[] | null;
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
