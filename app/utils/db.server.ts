import Database from "better-sqlite3";

import fs from "fs";
import path from "path";

const dbPath =
  process.env.NODE_ENV === "production"
    ? path.join("/data", "recipes.db")
    : path.join(process.cwd(), "data", "recipes.db");
const dataDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = 1");

// Database schema
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    tags TEXT, -- JSON array
    ingredients TEXT NOT NULL, -- JSON array
    instructions TEXT NOT NULL, -- JSON array
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
  CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes(tags);
  CREATE INDEX IF NOT EXISTS idx_recipes_is_default ON recipes(is_default);

  -- Trigger to update updated_at timestamp
  CREATE TRIGGER IF NOT EXISTS update_recipes_updated_at
    AFTER UPDATE ON recipes
    FOR EACH ROW
    BEGIN
      UPDATE recipes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
`;

export function initializeDatabase() {
  console.log(`Initializing database at: ${dbPath}`);

  try {
    // Create schema
    db.exec(SCHEMA);
    console.log("✅ Database schema created");

    // Initialize queries after schema is created
    initializeQueries();
    console.log("✅ Database queries prepared");

    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Prepared statements - will be initialized after schema creation
type QueriesType = {
  getAllRecipes: Database.Statement<unknown[], unknown>;
  getRecipeBySlug: Database.Statement<[string], unknown>;
  insertRecipe: Database.Statement<
    [
      string,
      string,
      string,
      number | null,
      number | null,
      number | null,
      string,
      string,
      string,
      number
    ],
    Database.RunResult
  >;
  updateRecipe: Database.Statement<
    [
      string,
      string,
      number | null,
      number | null,
      number | null,
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
};

export let queries: QueriesType | null = null;

function initializeQueries() {
  if (queries) return queries;

  queries = {
    getAllRecipes: db.prepare(`
      SELECT * FROM recipes 
      ORDER BY is_default DESC, created_at DESC
    `),

    getRecipeBySlug: db.prepare(`
      SELECT * FROM recipes 
      WHERE slug = ?
    `),

    insertRecipe: db.prepare(`
      INSERT INTO recipes (
        slug, title, summary, prep_time, cook_time, servings, 
        tags, ingredients, instructions, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),

    updateRecipe: db.prepare(`
      UPDATE recipes 
      SET title = ?, summary = ?, prep_time = ?, cook_time = ?, servings = ?,
          tags = ?, ingredients = ?, instructions = ?
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
