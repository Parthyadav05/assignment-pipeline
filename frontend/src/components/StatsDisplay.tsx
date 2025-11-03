'use client';

import { useState, useEffect } from 'react';
import { getStats } from '@/lib/api';
import { StatsResponse } from '@/types';

interface StatsDisplayProps {
  refreshTrigger: number;
}

export default function StatsDisplay({ refreshTrigger }: StatsDisplayProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Statistics</h2>
        <p style={styles.loading}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Statistics</h2>
        <p style={styles.error}>{error}</p>
        <button onClick={fetchStats} style={styles.refreshButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Statistics</h2>
        <button onClick={fetchStats} style={styles.refreshButton}>
          Refresh
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
          <div style={styles.statLabel}>Total Contacts</div>
          <div style={styles.statValue}>{stats?.totalContacts || 0}</div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
          <div style={styles.statLabel}>Valid Contacts</div>
          <div style={styles.statValue}>{stats?.validContacts || 0}</div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #ef4444' }}>
          <div style={styles.statLabel}>Invalid Attempts</div>
          <div style={styles.statValue}>{stats?.invalidAttempts || 0}</div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
          <div style={styles.statLabel}>Duplicate Attempts</div>
          <div style={styles.statValue}>{stats?.duplicateAttempts || 0}</div>
        </div>
      </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
  },
  loading: {
    color: '#6b7280',
  },
  error: {
    color: '#ef4444',
    marginBottom: '12px',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#374151',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
  },
};
