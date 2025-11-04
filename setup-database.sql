-- PostgreSQL Database Setup Script for Contact Pipeline
-- This version works in pgAdmin and other GUI tools

-- STEP 1: First, create the database manually:
-- Right-click "Databases" -> "Create" -> "Database"
-- Name: contacts_pipeline
-- Then connect to it and run the rest of this script

-- STEP 2: Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_phone_number ON contacts(phone_number);

-- STEP 3: Create processing_logs table
CREATE TABLE IF NOT EXISTS processing_logs (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('valid', 'invalid', 'duplicate')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_status ON processing_logs(status);

-- Verify setup
SELECT 'Database setup complete!' as message;
SELECT COUNT(*) as total_contacts FROM contacts;
SELECT COUNT(*) as total_logs FROM processing_logs;
