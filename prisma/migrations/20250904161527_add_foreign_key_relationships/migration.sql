-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recipe_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "deleted_at" DATETIME,
    "recipe_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "author_id" TEXT,
    CONSTRAINT "recipe_tags_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_tags_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_recipe_tags" ("author_id", "created_at", "deleted_at", "id", "recipe_id", "tag_id", "updated_at") SELECT "author_id", "created_at", "deleted_at", "id", "recipe_id", "tag_id", "updated_at" FROM "recipe_tags";
DROP TABLE "recipe_tags";
ALTER TABLE "new_recipe_tags" RENAME TO "recipe_tags";
CREATE UNIQUE INDEX "recipe_tags_recipe_id_tag_id_key" ON "recipe_tags"("recipe_id", "tag_id");
CREATE TABLE "new_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "author_id" TEXT,
    CONSTRAINT "tags_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tags" ("author_id", "created_at", "deleted_at", "display_name", "id", "is_default", "name", "updated_at") SELECT "author_id", "created_at", "deleted_at", "display_name", "id", "is_default", "name", "updated_at" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
