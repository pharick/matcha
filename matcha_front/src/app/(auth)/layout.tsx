import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Matcha',
    default: 'Matcha',
  },
  viewport: 'width=device-width, initial-scale=1',
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
  return (
    <html lang="en" className={montserrat.className}>
      <body className="min-h-screen sm:mx-10">{children}</body>
    </html>
  );
}
