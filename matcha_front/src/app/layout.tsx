import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import { DndProvider } from '@/imports/react-dnd';
import { HTML5Backend } from '@/imports/react-dnd';

import './globals.css';

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
  return (
    <html lang="en" className={montserrat.className}>
      <DndProvider backend={HTML5Backend}>
        <body className="mx-10">{children}</body>
      </DndProvider>
    </html>
  );
}
