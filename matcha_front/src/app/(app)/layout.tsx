import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import Header from '@/components/header/Header';
import { getCurrentUser } from '@/api/auth';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Matcha',
    default: 'Matcha',
  },
};

const montserrat = Montserrat({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUserPromise = getCurrentUser();

  return (
    <html lang="en" className={montserrat.className}>
      <body className="mx-10 min-h-screen">
        <Header currentUserPromise={currentUserPromise} />
        {children}
      </body>
    </html>
  );
}
