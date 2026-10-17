CREATE TABLE IF NOT EXISTS usage (
 bucket TEXT NOT NULL, day TEXT NOT NULL, count INTEGER NOT NULL,
 PRIMARY KEY (bucket, day)
);
CREATE TABLE IF NOT EXISTS leads (
 id TEXT PRIMARY KEY, email TEXT NOT NULL, interest TEXT NOT NULL,
 consent_version TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS leads_created_at ON leads(created_at);
