-- DropForeignKey
ALTER TABLE "poll_vote" DROP CONSTRAINT "poll_vote_poll_id_fkey";

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
