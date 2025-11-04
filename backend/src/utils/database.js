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
