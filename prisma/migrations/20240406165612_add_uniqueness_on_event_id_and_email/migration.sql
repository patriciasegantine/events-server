/*
  Warnings:

  - A unique constraint covering the columns `[eventId,email]` on the table `participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participants_eventId_email_key" ON "participants"("eventId", "email");
