'use client';

import { FC, useEffect, useState } from 'react';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';
import { AiFillHeart } from 'react-icons/ai';
import { differenceInYears, parseISO } from 'date-fns';

import { CurrentUser } from '@/interfaces';

interface UserInfoProps {
  user: CurrentUser;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  const [currentAge, setCurrentAge] = useState<number>(0);

  useEffect(() => {
    const getCurrentAge = () => {
      const date = parseISO(user.birth_date);
      const age = differenceInYears(new Date(), date);
      setCurrentAge(age);
    };
    void getCurrentAge();
  }, [user]);

  return (
    <div className="m-3 font-bold">
      <div className="flex text-xl">
        <h1 className="mr-2 rounded-lg bg-green-2 px-2">{user?.username}</h1>
        <h1>{currentAge}</h1>
        {user?.gender === 'male' && <PiGenderMaleBold />}
        {user?.gender === 'female' && <PiGenderFemaleBold />}
        {user?.gender === 'other' && <PiGenderIntersexBold />}
      </div>
      <div className="mb-5 flex">
        <h2 className="mr-2">{user?.first_name}</h2>
        <h2>{user?.last_name}</h2>
      </div>
      <div className="mb-5 flex items-center">
        {user?.gender_preferences.map((gender, index) => (
          <ul>
            <li key={index} className="mr-2 flex items-center rounded-lg bg-green-2 px-2">
              <AiFillHeart color="pink" />
              {gender == 'male' && <PiGenderMaleBold />}
              {gender == 'female' && <PiGenderFemaleBold />}
              {gender == 'other' && <PiGenderIntersexBold />}
            </li>
          </ul>
        ))}
      </div>
      {/*<div className="mb-5 flex flex-wrap justify-center">
        {user?.tags.map((tag) => (
          <ul>
            <li className="mb-2 mr-2 rounded-lg bg-green-2 px-2">{tag}</li>
          </ul>
        ))}
      </div>  */}
    </div>
  );
};

export default UserInfo;
