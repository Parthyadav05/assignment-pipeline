import { useState } from 'react';
import { uploadContacts } from '../lib/api';

export default function UploadForm({ onUploadComplete }) {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
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
          rows={12}
          style={styles.textarea}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'PROCESSING...' : 'UPLOAD CONTACTS'}
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
          {result.idempotencyKey && (
            <div style={styles.idempotencyInfo}>
              <span style={styles.idempotencyLabel}>Request ID:</span>
              <code style={styles.idempotencyKey}>{result.idempotencyKey}</code>
            </div>
          )}
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>TOTAL</span>
              <span style={styles.statValue}>{result.stats.total}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>VALID</span>
              <span style={styles.statValue}>{result.stats.valid}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>INVALID</span>
              <span style={styles.statValue}>{result.stats.invalid}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>DUPLICATES</span>
              <span style={styles.statValue}>{result.stats.duplicates}</span>
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
    border: '2px solid #000000',
    padding: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '300',
    marginBottom: '24px',
    color: '#000000',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    border: '1px solid #000000',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: 'monospace',
    resize: 'vertical',
    outline: 'none',
  },
  button: {
    padding: '16px 32px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '2px solid #000000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '2px',
    transition: 'all 0.3s ease',
  },
  error: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#000000',
    color: '#ffffff',
    textAlign: 'center',
  },
  result: {
    marginTop: '32px',
    padding: '24px',
    border: '1px solid #000000',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#000000',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    border: '1px solid #000000',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    letterSpacing: '1px',
    color: '#666666',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '300',
    color: '#000000',
  },
  idempotencyInfo: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    fontSize: '11px',
  },
  idempotencyLabel: {
    fontWeight: '600',
    marginRight: '8px',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  idempotencyKey: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: '4px 8px',
    border: '1px solid #cccccc',
    wordBreak: 'break-all',
  },
};
