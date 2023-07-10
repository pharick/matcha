'use client';
import './globals.css';
import { Montserrat } from 'next/font/google';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
        <body>{children}</body>
      </DndProvider>
    </html>
  );
}
