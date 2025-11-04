import { useState } from 'react';
import UploadForm from './components/UploadForm';
import StatsDisplay from './components/StatsDisplay';

export default function App() {
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
            Premium phone number management system with validation and deduplication
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
    backgroundColor: '#ffffff',
    padding: '48px 24px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '64px',
    paddingBottom: '32px',
    borderBottom: '2px solid #000000',
  },
  heading: {
    fontSize: '48px',
    fontWeight: '300',
    color: '#000000',
    marginBottom: '16px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: '16px',
    color: '#666666',
    fontWeight: '300',
    letterSpacing: '1px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '48px',
  },
  section: {
    minWidth: '0',
  },
};
