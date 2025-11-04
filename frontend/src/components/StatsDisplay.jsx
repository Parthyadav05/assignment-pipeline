import { useState, useEffect } from 'react';
import { getStats } from '../lib/api';

export default function StatsDisplay({ refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Statistics</h2>
        <button onClick={fetchStats} style={styles.refreshButton}>
          REFRESH
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>TOTAL CONTACTS</div>
          <div style={styles.statValue}>{stats?.totalContacts || 0}</div>
          <div style={styles.statBar}></div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>VALID CONTACTS</div>
          <div style={styles.statValue}>{stats?.validContacts || 0}</div>
          <div style={styles.statBar}></div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>INVALID ATTEMPTS</div>
          <div style={styles.statValue}>{stats?.invalidAttempts || 0}</div>
          <div style={styles.statBar}></div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>DUPLICATE ATTEMPTS</div>
          <div style={styles.statValue}>{stats?.duplicateAttempts || 0}</div>
          <div style={styles.statBar}></div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    border: '2px solid #000000',
    padding: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '300',
    color: '#000000',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  loading: {
    color: '#666666',
    textAlign: 'center',
    padding: '48px',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  error: {
    color: '#000000',
    marginBottom: '16px',
    textAlign: 'center',
    padding: '24px',
    border: '1px solid #000000',
  },
  refreshButton: {
    padding: '8px 20px',
    backgroundColor: '#ffffff',
    border: '1px solid #000000',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#000000',
    letterSpacing: '1px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  statCard: {
    padding: '32px 24px',
    border: '1px solid #000000',
    textAlign: 'center',
    position: 'relative',
  },
  statLabel: {
    fontSize: '11px',
    color: '#666666',
    marginBottom: '16px',
    fontWeight: '600',
    letterSpacing: '2px',
  },
  statValue: {
    fontSize: '48px',
    fontWeight: '300',
    color: '#000000',
    lineHeight: '1',
  },
  statBar: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '4px',
    backgroundColor: '#000000',
  },
};
