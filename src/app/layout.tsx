import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { validateEnv } from '@/utils/validateEnv';

// Validate environment variables during app initialization
try {
  validateEnv();
} catch (error: any) {
  console.error('Environment validation failed:', error.message);
  // You might want to show an error page in production
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AWS S3 Manager Dashboard',
  description: 'AWS S3 Manager Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
