-- Add Idempotency Table to Existing Database
-- Run this in pgAdmin or psql while connected to contacts_pipeline database

-- Create idempotency_keys table
CREATE TABLE IF NOT EXISTS idempotency_keys (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(255) UNIQUE NOT NULL,
  response_body JSONB NOT NULL,
  response_status INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create index on request_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_request_id ON idempotency_keys(request_id);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_expires_at ON idempotency_keys(expires_at);

-- Verify the table was created
SELECT 'Idempotency table added successfully!' as message;
SELECT COUNT(*) as idempotency_keys_count FROM idempotency_keys;

-- Show all tables in database
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
