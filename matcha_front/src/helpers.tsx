import { NextPage } from 'next';

import UserProvider from '@/components/UserProvider';
import PositionProvider from '@/components/PositionProvider';

export const withLogin = (page: NextPage) => {
  const Page = page;
  const PageWithLogin = () => (
    <UserProvider>
      <PositionProvider>
        <Page />
      </PositionProvider>
    </UserProvider>
  );
  return PageWithLogin;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
