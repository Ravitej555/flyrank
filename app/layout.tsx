import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlyRank — Intelligent Flight Ranking Engine',
  description: 'Multi-dimensional flight search and utility scoring platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
