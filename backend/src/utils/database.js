const { Pool } = require('pg');
const { Logger } = require('./logger');

let pool;

const connectDatabase = async () => {
  try {
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/contacts_pipeline';

    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test the connection
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();

    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_phone_number ON contacts(phone_number);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS processing_logs (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('valid', 'invalid', 'duplicate')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_status ON processing_logs(status);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS idempotency_keys (
        id SERIAL PRIMARY KEY,
        request_id VARCHAR(255) UNIQUE NOT NULL,
        response_body JSONB NOT NULL,
        response_status INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_request_id ON idempotency_keys(request_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expires_at ON idempotency_keys(expires_at);
    `);

    Logger.info('Database tables created/verified successfully');
  } catch (error) {
    Logger.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return pool;
};

const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    console.log('PostgreSQL connection closed');
  }
};

module.exports = {
  connectDatabase,
  getPool,
  closeDatabase,
};
