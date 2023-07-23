'use client';

import { FC, useEffect, useState } from 'react';

import { CurrentUser } from '@/interfaces';

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
    <div className="mr-5 h-screen w-[400px] rounded-xl border border-none bg-green-5/50 px-5 py-5">
      <ul className="font-bold [&>*]:mb-5">
        <li className="flex justify-between">
          <h1>Username:</h1>
          <h1>{user?.username}</h1>
        </li>
        <li className="flex justify-between">
          <h1>First Name:</h1>
          <h1>{user?.first_name}</h1>
        </li>
        <li className="flex justify-between">
          <h1>Last_Name:</h1>
          <h1>{user?.last_name}</h1>
        </li>
        <li className="flex justify-between">
          <h1>Gender:</h1>
          <h1>{user?.gender}</h1>
        </li>
        <li className="flex justify-between">
          <h1>Gender Preferences:</h1>
          <h1>{user?.gender_preferences}</h1>
        </li>
        <li className="flex justify-between">
          <h1>Bio:</h1>
          <h1>{user?.biography}</h1>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
