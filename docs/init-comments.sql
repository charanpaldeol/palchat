-- Run once against your Postgres DB (e.g. Neon SQL Editor or psql).
-- Creates the table the Palchat comments page expects.

CREATE TABLE IF NOT EXISTS comments (
  id   SERIAL PRIMARY KEY,
  comment TEXT
);

-- Optional: insert a test row so /comments shows something.
-- INSERT INTO comments (comment) VALUES ('Hello!');
