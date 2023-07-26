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
    <div className="mx-auto mt-10 max-w-[700px]">
      <div className="flex max-w-[700px] flex-wrap justify-center mb-10">
        <div className="m-right-2 h-[400px] w-[400px]">
          <UserPhoto username={username} />
        </div>
        <div className="flex max-w-[400px] flex-1">
          {user && <UserInfo user={user} />}
        </div>
      </div>
      <div className="mx-auto max-w-[700px]">
        <h1 className="text-xl font-bold mb-5 underline">Biography</h1>
        <div className="rounded-lg bg-neutral/50 p-3 mb-5">{user?.biography}</div>
        <h1 className="text-xl font-bold mb-5 underline">Interests</h1>
        <div className="flex flex-wrap">
          {user?.tags.map((tag) => (
            <ul>
              <li className="mb-5 mr-2 rounded-lg bg-green-2 px-2">{tag}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
