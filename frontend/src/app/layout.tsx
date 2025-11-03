import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Contact Pipeline',
  description: 'Upload and manage phone numbers with validation and deduplication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
