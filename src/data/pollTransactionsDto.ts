import { prisma } from '@/db';

/**
 * Gets the TX IDs based off of a list of poll_transaction IDs.
 * @param pollTransactionIds - Array of poll_transaction IDs
 * @returns Array of TX IDs for the poll_transaction IDs provided
 */
export async function pollTransactionsDto(
  pollTransactionIds: string[],
): Promise<string[]> {
  const bigIntIds = pollTransactionIds.map((id) => BigInt(id));

  const result = await prisma.poll_transaction.findMany({
    where: {
      id: {
        in: bigIntIds,
      },
    },
    select: {
      transaction_id: true,
    },
  });

  const txIds = result.map((tx) => tx.transaction_id);

  return txIds;
}
