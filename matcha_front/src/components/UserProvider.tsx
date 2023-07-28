'use client';

import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CurrentUser } from '../types';
import { useRouter, usePathname } from 'next/navigation';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: CurrentUser;
  getUser?: () => void;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | undefined>(undefined);
  const router = useRouter();
  const pathName = usePathname();

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

  useEffect(() => {
    void getUser();
  }, [router, pathName]);

  const value = useMemo(
    () => ({
      user,
      getUser,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
