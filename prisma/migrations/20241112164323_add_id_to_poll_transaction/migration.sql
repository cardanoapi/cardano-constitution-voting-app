/*
  Warnings:

  - The primary key for the `poll_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "poll_transaction" DROP CONSTRAINT "poll_transaction_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "poll_transaction_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_transaction_id_fkey" FOREIGN KEY ("poll_transaction_id") REFERENCES "poll_transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
