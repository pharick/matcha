'use client';

import { FC, useEffect, useState } from 'react';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';
import { AiFillHeart } from 'react-icons/ai';
import { CurrentUser } from '@/interfaces';

interface UserInfoProps {
  user: CurrentUser;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
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
              <AiFillHeart color='pink'/>
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
    </div>
  );
};

export default UserInfo;
