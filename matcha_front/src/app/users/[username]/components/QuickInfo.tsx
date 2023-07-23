'use client';

import { FC, useEffect, useState } from 'react';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';
import { AiFillHeart } from 'react-icons/ai';

import { CurrentUser } from '@/interfaces';

interface UserProfileProps {
  username: string;
}

const QuickInfo: FC<UserProfileProps> = ({ username }) => {
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
    <div className="m-3 text-center font-bold">
      <div className="flex justify-center text-xl">
        <h1 className="mr-2 px-2 bg-green-2 rounded-lg">{user?.username}</h1>
        {user?.gender === 'male' && <PiGenderMaleBold />}
        {user?.gender === 'female' && <PiGenderFemaleBold />}
        {user?.gender === 'other' && <PiGenderIntersexBold />}
      </div>
      <div className="flex justify-center mb-5">
        <h2 className="mr-2">{user?.first_name}</h2>
        <h2>{user?.last_name}</h2>
      </div>
      <div className="mb-5 flex items-center justify-center">
        {user?.gender_preferences.map((gender) => (
          <ul>
            <li className="mr-2 flex items-center rounded-lg bg-green-2 px-2">
              <AiFillHeart />
              {gender == 'male' && <PiGenderMaleBold />}
              {gender == 'female' && <PiGenderFemaleBold />}
              {gender == 'other' && <PiGenderIntersexBold />}
            </li>
          </ul>
        ))}
      </div>
      <div className="mb-5 flex justify-center flex-wrap">
        {user?.tags.map((tag) => (
          <ul>
            <li className="mr-2 rounded-lg bg-green-2 px-2 mb-2">{tag}</li>
          </ul>
        ))}
      </div>
      <div className="bg-neutral/50 rounded-lg">{user?.biography}</div>
    </div>
  );
};

export default QuickInfo;
