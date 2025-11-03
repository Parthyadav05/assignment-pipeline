'use client';

import { useState } from 'react';
import { uploadContacts } from '@/lib/api';
import { BulkUploadResponse } from '@/types';

interface UploadFormProps {
  onUploadComplete: () => void;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const numbers = phoneNumbers
        .split('\n')
        .map((num) => num.trim())
        .filter((num) => num.length > 0);

      if (numbers.length === 0) {
        setError('Please enter at least one phone number');
        setLoading(false);
        return;
      }

      const response = await uploadContacts(numbers);
      setResult(response);
      onUploadComplete();
      setPhoneNumbers('');
    } catch (err) {
      setError('Failed to upload contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Phone Numbers</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={phoneNumbers}
          onChange={(e) => setPhoneNumbers(e.target.value)}
          placeholder="Enter phone numbers (one per line)&#10;Example:&#10;+1234567890&#10;+9876543210&#10;1234567890"
          rows={10}
          style={styles.textarea}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Uploading...' : 'Upload Contacts'}
        </button>
      </form>

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>Upload Results</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total:</span>
              <span style={styles.statValue}>{result.stats.total}</span>
            </div>
            <div style={styles.statItem}>
              <span style={{ ...styles.statLabel, color: '#10b981' }}>Valid:</span>
              <span style={{ ...styles.statValue, color: '#10b981' }}>
                {result.stats.valid}
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={{ ...styles.statLabel, color: '#ef4444' }}>Invalid:</span>
              <span style={{ ...styles.statValue, color: '#ef4444' }}>
                {result.stats.invalid}
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={{ ...styles.statLabel, color: '#f59e0b' }}>Duplicates:</span>
              <span style={{ ...styles.statValue, color: '#f59e0b' }}>
                {result.stats.duplicates}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#111827',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontFamily: 'monospace',
    resize: 'vertical' as const,
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  error: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fee2e2',
    borderRadius: '6px',
    color: '#991b1b',
  },
  result: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#111827',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
  },
};
