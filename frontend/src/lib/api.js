const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generate a unique idempotency key
 * Uses crypto.randomUUID() for modern browsers
 */
const generateIdempotencyKey = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Upload contacts with idempotency key to prevent duplicate processing
 * @param {string[]} phoneNumbers - Array of phone numbers to upload
 * @param {string} [idempotencyKey] - Optional custom idempotency key (auto-generated if not provided)
 */
export const uploadContacts = async (phoneNumbers, idempotencyKey = null) => {
  const requestId = idempotencyKey || generateIdempotencyKey();

  const response = await fetch(`${API_URL}/contacts/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': requestId,
    },
    body: JSON.stringify({ phoneNumbers }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload contacts');
  }

  const data = await response.json();

  // Return both data and the idempotency key for reference
  return {
    ...data,
    idempotencyKey: requestId,
  };
};

export const getStats = async () => {
  const response = await fetch(`${API_URL}/contacts/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
};
