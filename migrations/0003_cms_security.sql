PRAGMA foreign_keys = ON;

ALTER TABLE users ADD COLUMN totp_secret TEXT;
ALTER TABLE users ADD COLUMN totp_pending_secret TEXT;
ALTER TABLE users ADD COLUMN totp_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sessions ADD COLUMN reauth_until TEXT;
-- D1/SQLite non consente CURRENT_TIMESTAMP come default durante ALTER TABLE.
-- La colonna viene inizializzata subito e i nuovi accessi la aggiornano dall'API.
ALTER TABLE sessions ADD COLUMN last_seen_at TEXT;
UPDATE sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE last_seen_at IS NULL;
ALTER TABLE sessions ADD COLUMN user_agent TEXT;
ALTER TABLE sessions ADD COLUMN ip_hash TEXT;

CREATE TABLE IF NOT EXISTS login_attempts (
  attempt_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS login_attempts_key_time ON login_attempts(attempt_key, created_at);

CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  event_type TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS security_events_user_time ON security_events(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS recovery_codes (
  code_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS recovery_codes_user ON recovery_codes(user_id, used_at);

CREATE TABLE IF NOT EXISTS cms_contents (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('articolo','progetto','guida','recensione')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('guide','soluzioni','test','recensioni')),
  body TEXT NOT NULL DEFAULT '',
  tags_json TEXT NOT NULL DEFAULT '[]',
  image TEXT,
  image_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','hidden','trash')),
  repository_sha TEXT,
  published_at TEXT,
  deleted_at TEXT,
  created_by TEXT NOT NULL REFERENCES users(id),
  updated_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS cms_contents_status_time ON cms_contents(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS cms_revisions (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES cms_contents(id) ON DELETE CASCADE,
  snapshot_json TEXT NOT NULL,
  action TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS cms_revisions_content_time ON cms_revisions(content_id, created_at DESC);
