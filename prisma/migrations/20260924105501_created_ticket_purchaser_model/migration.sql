-- CreateTable
CREATE TABLE "ticket_purchasers" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_purchasers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_purchasers_ticketId_idx" ON "ticket_purchasers"("ticketId");

-- CreateIndex
CREATE INDEX "ticket_purchasers_userId_idx" ON "ticket_purchasers"("userId");

-- AddForeignKey
ALTER TABLE "ticket_purchasers" ADD CONSTRAINT "ticket_purchasers_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_purchasers" ADD CONSTRAINT "ticket_purchasers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
