-- CreateTable
CREATE TABLE "poll" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(10000),
    "status" VARCHAR(100) NOT NULL DEFAULT 'pending',
    "summary_tx_id" VARCHAR(255),

    CONSTRAINT "poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_transaction" (
    "poll_id" BIGINT NOT NULL,
    "transaction_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "poll_transaction_pkey" PRIMARY KEY ("poll_id","transaction_id")
);

-- CreateTable
CREATE TABLE "poll_vote" (
    "poll_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "vote" VARCHAR(100) NOT NULL,
    "signature" VARCHAR(255) NOT NULL,
    "hashed_message" VARCHAR(255) NOT NULL,
    "poll_transaction_id" BIGINT,

    CONSTRAINT "poll_vote_pkey" PRIMARY KEY ("poll_id","user_id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "is_convention_organizer" BOOLEAN NOT NULL DEFAULT false,
    "is_delegate" BOOLEAN NOT NULL DEFAULT false,
    "is_alternate" BOOLEAN NOT NULL DEFAULT false,
    "workshop_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "color" VARCHAR(100),
    "wallet_address" VARCHAR(100) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "delegate_id" BIGINT,
    "alternate_id" BIGINT,
    "active_voter_id" BIGINT,

    CONSTRAINT "workshop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "poll_summary_tx_id_key" ON "poll"("summary_tx_id");

-- CreateIndex
CREATE UNIQUE INDEX "poll_transaction_transaction_id_key" ON "poll_transaction"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "poll_vote_signature_key" ON "poll_vote"("signature");

-- CreateIndex
CREATE UNIQUE INDEX "poll_vote_poll_transaction_id_key" ON "poll_vote"("poll_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_address_key" ON "user"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "workshop_delegate_id_key" ON "workshop"("delegate_id");

-- CreateIndex
CREATE UNIQUE INDEX "workshop_alternate_id_key" ON "workshop"("alternate_id");

-- CreateIndex
CREATE UNIQUE INDEX "workshop_active_voter_id_key" ON "workshop"("active_voter_id");

-- AddForeignKey
ALTER TABLE "poll_transaction" ADD CONSTRAINT "poll_transaction_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshop"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_active_voter_id_fkey" FOREIGN KEY ("active_voter_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_alternate_id_fkey" FOREIGN KEY ("alternate_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workshop" ADD CONSTRAINT "workshop_delegate_id_fkey" FOREIGN KEY ("delegate_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
