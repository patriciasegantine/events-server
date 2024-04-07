-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_checkIns" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participantId" INTEGER NOT NULL,
    CONSTRAINT "checkIns_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_checkIns" ("createdAt", "id", "participantId") SELECT "createdAt", "id", "participantId" FROM "checkIns";
DROP TABLE "checkIns";
ALTER TABLE "new_checkIns" RENAME TO "checkIns";
CREATE UNIQUE INDEX "checkIns_participantId_key" ON "checkIns"("participantId");
CREATE TABLE "new_participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_participants" ("createdAt", "email", "eventId", "id", "name") SELECT "createdAt", "email", "eventId", "id", "name" FROM "participants";
DROP TABLE "participants";
ALTER TABLE "new_participants" RENAME TO "participants";
CREATE UNIQUE INDEX "participants_eventId_email_key" ON "participants"("eventId", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
