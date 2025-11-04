const { getPool } = require('../utils/database');
const { validatePhoneNumber, normalizePhoneNumber } = require('../utils/validation');
const { Logger } = require('../utils/logger');

class ContactService {
  async processBulkContacts(phoneNumbers) {
    const valid = [];
    const invalid = [];
    const duplicates = [];

    const normalizedNumbers = new Set();

    for (const phoneNumber of phoneNumbers) {
      const normalized = normalizePhoneNumber(phoneNumber);

      if (!validatePhoneNumber(normalized)) {
        invalid.push(phoneNumber);
        continue;
      }

      if (normalizedNumbers.has(normalized)) {
        duplicates.push(phoneNumber);
        continue;
      }

      normalizedNumbers.add(normalized);
      valid.push(normalized);
    }

    // Check for existing contacts in database
    const pool = getPool();
    const placeholders = valid.map((_, i) => `$${i + 1}`).join(',');

    if (valid.length > 0) {
      const existingContactsQuery = `
        SELECT phone_number FROM contacts WHERE phone_number IN (${placeholders})
      `;
      const result = await pool.query(existingContactsQuery, valid);
      const existingNumbers = new Set(result.rows.map(row => row.phone_number));

      const newValidNumbers = valid.filter((num) => {
        if (existingNumbers.has(num)) {
          duplicates.push(num);
          return false;
        }
        return true;
      });

      return {
        valid: newValidNumbers,
        invalid,
        duplicates,
      };
    }

    return {
      valid,
      invalid,
      duplicates,
    };
  }

  async saveContactsWithTransaction(result) {
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert valid contacts
      if (result.valid.length > 0) {
        const contactValues = result.valid.map((phoneNumber, i) =>
          `($${i + 1})`
        ).join(',');

        await client.query(
          `INSERT INTO contacts (phone_number) VALUES ${contactValues}`,
          result.valid
        );

        // Log valid entries
        const validLogValues = result.valid.map((phoneNumber, i) =>
          `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');
        const validLogParams = result.valid.flatMap(num => [num, 'valid']);

        await client.query(
          `INSERT INTO processing_logs (phone_number, status) VALUES ${validLogValues}`,
          validLogParams
        );
      }

      // Log invalid entries
      if (result.invalid.length > 0) {
        const invalidLogValues = result.invalid.map((phoneNumber, i) =>
          `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');
        const invalidLogParams = result.invalid.flatMap(num => [num, 'invalid']);

        await client.query(
          `INSERT INTO processing_logs (phone_number, status) VALUES ${invalidLogValues}`,
          invalidLogParams
        );
      }

      // Log duplicate entries
      if (result.duplicates.length > 0) {
        const duplicateLogValues = result.duplicates.map((phoneNumber, i) =>
          `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(',');
        const duplicateLogParams = result.duplicates.flatMap(num => [num, 'duplicate']);

        await client.query(
          `INSERT INTO processing_logs (phone_number, status) VALUES ${duplicateLogValues}`,
          duplicateLogParams
        );
      }

      await client.query('COMMIT');

      Logger.info('Transaction completed successfully', {
        valid: result.valid.length,
        invalid: result.invalid.length,
        duplicates: result.duplicates.length,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      Logger.error('Transaction failed', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getStats() {
    const pool = getPool();

    const totalContactsResult = await pool.query('SELECT COUNT(*) FROM contacts');
    const totalContacts = parseInt(totalContactsResult.rows[0].count);

    const validCountResult = await pool.query(
      "SELECT COUNT(*) FROM processing_logs WHERE status = 'valid'"
    );
    const validCount = parseInt(validCountResult.rows[0].count);

    const invalidCountResult = await pool.query(
      "SELECT COUNT(*) FROM processing_logs WHERE status = 'invalid'"
    );
    const invalidCount = parseInt(invalidCountResult.rows[0].count);

    const duplicateCountResult = await pool.query(
      "SELECT COUNT(*) FROM processing_logs WHERE status = 'duplicate'"
    );
    const duplicateCount = parseInt(duplicateCountResult.rows[0].count);

    return {
      totalContacts,
      validContacts: validCount,
      invalidAttempts: invalidCount,
      duplicateAttempts: duplicateCount,
    };
  }
}

module.exports = { ContactService };
