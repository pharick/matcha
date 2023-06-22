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

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: User;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:8000/whoami', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = (await res.json()) as User;
        setUser(user);
      }
    };
    void getUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
