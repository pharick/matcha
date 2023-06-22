import './globals.css';
import UserProvider from '../components/UserProvider';

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
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
