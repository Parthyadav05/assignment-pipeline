'use client';

import { useState } from 'react';
import UploadForm from '@/components/UploadForm';
import StatsDisplay from '@/components/StatsDisplay';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.heading}>Contact Pipeline</h1>
          <p style={styles.subheading}>
            Upload and manage phone numbers with validation and deduplication
          </p>
        </header>

        <div style={styles.grid}>
          <div style={styles.section}>
            <UploadForm onUploadComplete={handleUploadComplete} />
          </div>

          <div style={styles.section}>
            <StatsDisplay refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '16px',
    color: '#6b7280',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
  },
  section: {
    minWidth: '0',
  },
};
