import './globals.css';
import UserProvider from '../components/UserProvider';
import { Montserrat } from 'next/font/google';

export const metadata = {
  title: 'Matcha',
  description: 'Made with ❤️ by 42Bankgok',
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
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
