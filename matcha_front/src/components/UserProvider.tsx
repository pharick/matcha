'use client';

import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CurrentUser } from '@/interfaces';
import { useRouter, usePathname } from 'next/navigation';
import { NextPage } from 'next';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: CurrentUser;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | undefined>(undefined);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch(`/api/whoami`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = (await res.json()) as CurrentUser;
        setUser(user);
      } else {
        router.push('/login');
        return;
      }
    };
    void getUser();
  }, [router, pathName]);

  const value = useMemo(
    () => ({
      user,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const withLogin = (page: NextPage) => {
  const Page = page;
  const PageWithLogin = () => (
    <UserProvider>
      <Page />
    </UserProvider>
  );
  return PageWithLogin;
};

export default UserProvider;
