'use client';
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '@/app/interfaces';
import { useRouter, usePathname } from 'next/navigation';
import { NextPage } from 'next';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: User;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch('http://localhost:8000/whoami', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = (await res.json()) as User;
        console.log(user);
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

export const withLogin = (children?: ReactNode) => {
  const page: NextPage = () => <UserProvider>{children}</UserProvider>;
  return page;
};

export default UserProvider;
