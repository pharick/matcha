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
      //   const userResponse = await fetch('/api/users/me');
      //   if (userResponse.ok) {
      //     const user = (await userResponse.json()) as User;
      //     setUser(user);
      setUser({
        username: 'milya',
        first_name: 'milya',
        last_name: 'milyanova',
        id: 1,
        email: '8milia01@mail.ru',
      });
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
