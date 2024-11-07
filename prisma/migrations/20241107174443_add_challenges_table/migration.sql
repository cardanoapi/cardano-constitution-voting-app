-- CreateTable
CREATE TABLE "challenge" (
    "id" VARCHAR(255) NOT NULL,
    "expire_time" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "challenge_id_key" ON "challenge"("id");
