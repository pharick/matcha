import './globals.css';
import { Inter } from 'next/font/google';
import UserProvider from './test';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Matcha',
  description: 'Made with ❤️ by 42Bankgok',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
