import { NextPage } from 'next';
import UserProvider from '@/components/UserProvider';

export const withLogin = (page: NextPage) => {
  const Page = page;
  const PageWithLogin = () => (
    <UserProvider>
      <Page />
    </UserProvider>
  );
  return PageWithLogin;
};
