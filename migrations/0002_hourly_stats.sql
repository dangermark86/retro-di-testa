CREATE TABLE IF NOT EXISTS hourly_stats (
  content_id TEXT NOT NULL,
  content_title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  hour TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Non disponibile',
  views INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (content_id, hour, country)
);

CREATE TABLE IF NOT EXISTS hourly_visitors (
  content_id TEXT NOT NULL,
  hour TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  PRIMARY KEY (content_id, hour, visitor_hash)
);

CREATE INDEX IF NOT EXISTS hourly_stats_hour ON hourly_stats(hour DESC);
