import { BulkUploadResponse, StatsResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const uploadContacts = async (phoneNumbers: string[]): Promise<BulkUploadResponse> => {
  const response = await fetch(`${API_URL}/contacts/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumbers }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload contacts');
  }

  return response.json();
};

export const getStats = async (): Promise<StatsResponse> => {
  const response = await fetch(`${API_URL}/contacts/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
};
