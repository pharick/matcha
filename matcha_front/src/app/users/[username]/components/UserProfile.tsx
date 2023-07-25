'use client';

import { FC, useEffect, useState } from 'react';

import { CurrentUser } from '@/interfaces';
import UserPhoto from './UserPhoto';
import UserInfo from './UserInfo';
import UserBiography from './UserBiography';

interface UserProfileProps {
  username: string;
}

const UserProfile: FC<UserProfileProps> = ({ username }) => {
  const [user, setUser] = useState<CurrentUser | undefined>(undefined);

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const getUser = async () => {
      const requestOptions = {
        headers: { Authorization: `Bearer ${userToken}` },
      };
      const uri = `/api/users/${username}`;
      const res = await fetch(uri, requestOptions);
      if (res.ok) {
        const user = (await res.json()) as CurrentUser;
        setUser(user);
      }
    };
    void getUser();
  }, [username]);

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-[700px] flex-wrap justify-center">
        <div className="h-[400px] w-[400px] p-2">
          <UserPhoto username={username} />
        </div>
        <div className="flex h-[300px] min-w-[300px] flex-1 items-center p-2">
          {user && <UserInfo user={user} />}
        </div>
      </div>
      <div className="mx-auto max-w-[700px] rounded-lg bg-neutral/50 p-3">
        {user && <UserBiography user={user} />}
      </div>
    </>
  );
};

export default UserProfile;
