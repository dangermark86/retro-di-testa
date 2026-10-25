PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'moderator')),
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  must_change INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  csrf_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('Articolo', 'Progetto')),
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Non disponibile',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'trash')),
  featured INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS comments_content_status ON comments(content_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS content_stats (
  content_id TEXT NOT NULL,
  content_title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  day TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0,
  completion_sum INTEGER NOT NULL DEFAULT 0,
  completion_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (content_id, day)
);

CREATE TABLE IF NOT EXISTS daily_visitors (
  content_id TEXT NOT NULL,
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  PRIMARY KEY (content_id, day, visitor_hash)
);

CREATE TABLE IF NOT EXISTS country_stats (
  country TEXT NOT NULL,
  day TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (country, day)
);

CREATE TABLE IF NOT EXISTS reactions (
  content_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (content_id, visitor_hash)
);

CREATE TABLE IF NOT EXISTS comment_reactions (
  comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id, visitor_hash)
);

INSERT OR IGNORE INTO users
  (id, name, email, username, role, password_salt, password_hash, active, must_change)
VALUES
  ('owner', 'Marco Sala', 'retroditesta@gmx.de', 'marco.sala', 'owner',
   'cea1f5d3b7b2a87bbd0e4d60047f861bbb76eac55ea2ae1d',
   '3a45068548a9a45c2d62981f7cc5a837f53d2cc7bd8d84059b70ab5bb23e0bf6',
   1, 1);
