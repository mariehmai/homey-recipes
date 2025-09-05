import Database from "better-sqlite3";

import fs from "fs";
import path from "path";

import { seedDefaultRecipes } from "./seed.server";

const dbPath =
  process.env.NODE_ENV === "production"
    ? path.join("/data", "papilles_et_mami.db")
    : path.join(process.cwd(), "data", "papilles_et_mami.db");
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = 1");

let isInitialized = false;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    username TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    emoji TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    author TEXT DEFAULT 'Anonymous',
    user_id TEXT,
    tags TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    is_public BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS recipe_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_slug TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    user_ip TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_slug) REFERENCES recipes(slug) ON DELETE CASCADE,
    UNIQUE(recipe_slug, user_ip)
  );

  CREATE TABLE IF NOT EXISTS recipe_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_slug TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'Anonymous',
    comment TEXT NOT NULL,
    user_ip TEXT NOT NULL,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_slug) REFERENCES recipes(slug) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_slug TEXT NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (recipe_slug, tag_id),
    FOREIGN KEY (recipe_slug) REFERENCES recipes(slug) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
  CREATE INDEX IF NOT EXISTS idx_recipes_is_default ON recipes(is_default);
  CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
  CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
  CREATE INDEX IF NOT EXISTS idx_recipe_ratings_slug ON recipe_ratings(recipe_slug);
  CREATE INDEX IF NOT EXISTS idx_recipe_comments_slug ON recipe_comments(recipe_slug);
  CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
  CREATE INDEX IF NOT EXISTS idx_tags_is_default ON tags(is_default);
  CREATE INDEX IF NOT EXISTS idx_recipe_tags_recipe ON recipe_tags(recipe_slug);
  CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag ON recipe_tags(tag_id);

  CREATE TRIGGER IF NOT EXISTS update_recipes_updated_at
    AFTER UPDATE ON recipes
    FOR EACH ROW
    BEGIN
      UPDATE recipes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
`;

export function initializeDatabase() {
  if (isInitialized) return true;

  console.log(`🗄️ Initializing database at: ${dbPath}`);

  try {
    db.exec(SCHEMA);
    console.log("✅ Database schema created");

    initializeQueries();
    console.log("✅ Database queries prepared");

    seedDefaultRecipes();
    console.log("✅ Default recipes seeded");

    isInitialized = true;
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

type QueriesType = {
  getAllRecipes: Database.Statement<unknown[], unknown>;
  getRecipeBySlug: Database.Statement<[string], unknown>;
  insertRecipe: Database.Statement<
    [
      string,
      string,
      string,
      string | null,
      number | null,
      number | null,
      number | null,
      string | null,
      string,
      string,
      string,
      string,
      number,
      number
    ],
    Database.RunResult
  >;
  updateRecipe: Database.Statement<
    [
      string,
      string,
      string | null,
      number | null,
      number | null,
      number | null,
      string,
      string,
      string,
      string,
      string
    ],
    Database.RunResult
  >;
  deleteRecipe: Database.Statement<[string], Database.RunResult>;
  recipeExists: Database.Statement<[string], unknown>;
  countDefaultRecipes: Database.Statement<unknown[], unknown>;

  // Rating queries
  getRecipeRating: Database.Statement<[string], unknown>;
  getUserRating: Database.Statement<[string, string], unknown>;
  insertRating: Database.Statement<
    [string, number, string],
    Database.RunResult
  >;
  updateRating: Database.Statement<
    [number, string, string],
    Database.RunResult
  >;

  // Comment queries
  getRecipeComments: Database.Statement<[string], unknown>;
  insertComment: Database.Statement<
    [string, string, string, string, string | null],
    Database.RunResult
  >;
  updateComment: Database.Statement<
    [string, number, string],
    Database.RunResult
  >;
  deleteComment: Database.Statement<[number], Database.RunResult>;

  // Tag queries
  getAllTags: Database.Statement<unknown[], unknown>;
  getRecipeTags: Database.Statement<[string], unknown>;
  insertTag: Database.Statement<[string, string, number], Database.RunResult>;
  addTagToRecipe: Database.Statement<[string, number], Database.RunResult>;
  removeTagFromRecipe: Database.Statement<[string, number], Database.RunResult>;
  clearRecipeTags: Database.Statement<[string], Database.RunResult>;

  // User queries
  getUserById: Database.Statement<[string], unknown>;
  insertOrUpdateUser: Database.Statement<
    [string, string, string, string | null, string],
    Database.RunResult
  >;
  updateUserProfile: Database.Statement<
    [string | null, string],
    Database.RunResult
  >;
};

export let queries: QueriesType | null = null;

function initializeQueries() {
  if (queries) return queries;

  queries = {
    getAllRecipes: db.prepare(`
      SELECT r.*,
        COALESCE(AVG(rt.rating), 0) as average_rating,
        COUNT(rt.rating) as rating_count,
        COUNT(c.id) as comment_count
      FROM recipes r
      LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
      LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
      GROUP BY r.id
      ORDER BY r.is_default DESC, r.created_at DESC
    `),

    getRecipeBySlug: db.prepare(`
      SELECT r.*,
        COALESCE(AVG(rt.rating), 0) as average_rating,
        COUNT(rt.rating) as rating_count,
        COUNT(c.id) as comment_count
      FROM recipes r
      LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
      LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
      WHERE r.slug = ?
      GROUP BY r.id
    `),

    insertRecipe: db.prepare(`
      INSERT INTO recipes (
        slug, title, summary, emoji, prep_time, cook_time, servings, user_id,
        tags, ingredients, instructions, author, is_default, is_public
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),

    updateRecipe: db.prepare(`
      UPDATE recipes 
      SET title = ?, summary = ?, emoji = ?, prep_time = ?, cook_time = ?, servings = ?,
          tags = ?, ingredients = ?, instructions = ?, author = ?
      WHERE slug = ?
    `),

    deleteRecipe: db.prepare(`
      DELETE FROM recipes 
      WHERE slug = ? AND is_default = 0
    `),

    recipeExists: db.prepare(`
      SELECT 1 FROM recipes WHERE slug = ?
    `),

    countDefaultRecipes: db.prepare(`
      SELECT COUNT(*) as count FROM recipes WHERE is_default = 1
    `),

    // Rating queries
    getRecipeRating: db.prepare(`
      SELECT AVG(rating) as average_rating, COUNT(*) as rating_count 
      FROM recipe_ratings 
      WHERE recipe_slug = ?
    `),

    getUserRating: db.prepare(`
      SELECT rating FROM recipe_ratings 
      WHERE recipe_slug = ? AND user_ip = ?
    `),

    insertRating: db.prepare(`
      INSERT INTO recipe_ratings (recipe_slug, rating, user_ip) 
      VALUES (?, ?, ?)
    `),

    updateRating: db.prepare(`
      UPDATE recipe_ratings 
      SET rating = ? 
      WHERE recipe_slug = ? AND user_ip = ?
    `),

    // Comment queries
    getRecipeComments: db.prepare(`
      SELECT id, author_name, comment, created_at, user_id 
      FROM recipe_comments 
      WHERE recipe_slug = ? 
      ORDER BY created_at DESC
    `),

    insertComment: db.prepare(`
      INSERT INTO recipe_comments (recipe_slug, author_name, comment, user_ip, user_id) 
      VALUES (?, ?, ?, ?, ?)
    `),

    updateComment: db.prepare(`
      UPDATE recipe_comments 
      SET comment = ? 
      WHERE id = ? AND user_id = ?
    `),

    deleteComment: db.prepare(`
      DELETE FROM recipe_comments 
      WHERE id = ?
    `),

    // Tag queries
    getAllTags: db.prepare(`
      SELECT * FROM tags 
      ORDER BY is_default DESC, name ASC
    `),

    getRecipeTags: db.prepare(`
      SELECT t.* 
      FROM tags t
      JOIN recipe_tags rt ON t.id = rt.tag_id
      WHERE rt.recipe_slug = ?
      ORDER BY t.name ASC
    `),

    insertTag: db.prepare(`
      INSERT INTO tags (name, display_name, is_default) 
      VALUES (?, ?, ?)
    `),

    addTagToRecipe: db.prepare(`
      INSERT OR IGNORE INTO recipe_tags (recipe_slug, tag_id) 
      VALUES (?, ?)
    `),

    removeTagFromRecipe: db.prepare(`
      DELETE FROM recipe_tags 
      WHERE recipe_slug = ? AND tag_id = ?
    `),

    clearRecipeTags: db.prepare(`
      DELETE FROM recipe_tags 
      WHERE recipe_slug = ?
    `),

    // User queries
    getUserById: db.prepare(`
      SELECT * FROM users WHERE id = ?
    `),

    insertOrUpdateUser: db.prepare(`
      INSERT OR REPLACE INTO users (id, email, name, username, avatar) 
      VALUES (?, ?, ?, ?, ?)
    `),

    updateUserProfile: db.prepare(`
      UPDATE users SET username = ? WHERE id = ?
    `),
  };

  return queries;
}

// Graceful shutdown
process.on("exit", () => db.close());
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  db.close();
  process.exit(0);
});
