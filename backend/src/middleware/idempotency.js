const { getPool } = require('../utils/database');
const { Logger } = require('../utils/logger');

const IDEMPOTENCY_HEADER = 'X-Idempotency-Key';
const IDEMPOTENCY_EXPIRY_HOURS = 24; // Keep idempotency records for 24 hours

/**
 * Middleware to handle idempotency for POST requests
 * Prevents duplicate processing of requests with the same idempotency key
 */
const idempotencyMiddleware = async (req, res, next) => {
  // Only apply to POST requests
  if (req.method !== 'POST') {
    return next();
  }

  const requestId = req.headers[IDEMPOTENCY_HEADER.toLowerCase()];

  // If no idempotency key provided, proceed normally
  if (!requestId) {
    Logger.warn('Request received without idempotency key', {
      path: req.path,
      method: req.method,
    });
    return next();
  }

  const pool = getPool();

  try {
    // Check if this request has been processed before
    const existingRequest = await pool.query(
      'SELECT response_body, response_status FROM idempotency_keys WHERE request_id = $1 AND expires_at > NOW()',
      [requestId]
    );

    if (existingRequest.rows.length > 0) {
      // Request already processed, return cached response
      const { response_body, response_status } = existingRequest.rows[0];

      Logger.info('Idempotent request detected - returning cached response', {
        requestId,
        path: req.path,
      });

      return res.status(response_status).json(response_body);
    }

    // Store the idempotency key on the request for later use
    req.idempotencyKey = requestId;

    // Override res.json to intercept and cache the response
    const originalJson = res.json.bind(res);
    res.json = async function (body) {
      try {
        // Calculate expiry time
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + IDEMPOTENCY_EXPIRY_HOURS);

        // Store the response in the database
        await pool.query(
          `INSERT INTO idempotency_keys (request_id, response_body, response_status, expires_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (request_id) DO NOTHING`,
          [requestId, JSON.stringify(body), res.statusCode, expiresAt]
        );

        Logger.info('Stored idempotency key', {
          requestId,
          statusCode: res.statusCode,
        });
      } catch (error) {
        Logger.error('Error storing idempotency key', error);
        // Don't fail the request if we can't store the idempotency key
      }

      return originalJson(body);
    };

    next();
  } catch (error) {
    Logger.error('Error in idempotency middleware', error);
    // If there's an error with idempotency, proceed with the request anyway
    next();
  }
};

/**
 * Cleanup expired idempotency keys (can be run periodically)
 */
const cleanupExpiredKeys = async () => {
  const pool = getPool();

  try {
    const result = await pool.query(
      'DELETE FROM idempotency_keys WHERE expires_at < NOW()'
    );

    Logger.info('Cleaned up expired idempotency keys', {
      deletedCount: result.rowCount,
    });

    return result.rowCount;
  } catch (error) {
    Logger.error('Error cleaning up idempotency keys', error);
    throw error;
  }
};

module.exports = {
  idempotencyMiddleware,
  cleanupExpiredKeys,
  IDEMPOTENCY_HEADER,
};
