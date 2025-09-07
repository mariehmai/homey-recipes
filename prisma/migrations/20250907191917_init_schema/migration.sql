-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "avatar" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "emoji" TEXT,
    "prep_time" INTEGER,
    "cook_time" INTEGER,
    "servings" INTEGER,
    "author" TEXT NOT NULL DEFAULT 'Anonymous',
    "user_id" TEXT,
    "tags" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recipe_ratings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipe_slug" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "user_ip" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recipe_ratings_recipe_slug_fkey" FOREIGN KEY ("recipe_slug") REFERENCES "recipes" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recipe_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipe_slug" TEXT NOT NULL,
    "author_name" TEXT NOT NULL DEFAULT 'Anonymous',
    "comment" TEXT NOT NULL,
    "user_ip" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recipe_comments_recipe_slug_fkey" FOREIGN KEY ("recipe_slug") REFERENCES "recipes" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "recipe_tags" (
    "recipe_slug" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,
    PRIMARY KEY ("recipe_slug", "tag_id"),
    CONSTRAINT "recipe_tags_recipe_slug_fkey" FOREIGN KEY ("recipe_slug") REFERENCES "recipes" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes" ("slug");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ratings_recipe_slug_user_ip_key" ON "recipe_ratings" ("recipe_slug", "user_ip");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags" ("name");