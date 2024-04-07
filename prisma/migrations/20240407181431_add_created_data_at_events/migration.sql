-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_participant" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_event" ("details", "id", "maximum_participant", "slug", "title") SELECT "details", "id", "maximum_participant", "slug", "title" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
