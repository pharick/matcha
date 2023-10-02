import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { redirect } from 'next/navigation';

import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/api/auth';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <div className="mx-10 flex min-h-screen flex-col">
          <Header currentUser={currentUser} />
          <div className="relative flex-1">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
