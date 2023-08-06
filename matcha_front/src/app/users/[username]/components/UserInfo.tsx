'use client';

import { FC } from 'react';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { AiFillHeart } from 'react-icons/ai';
import { birthdateToAge } from '@/helpers';
import { useState } from 'react';

interface UserInfoProps {
  user: User;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="w-full flex-1 font-bold">
        <h1 className="inline-block w-fit text-2xl">
          {user.first_name} {user.last_name}
        </h1>

        <div className="mb-3 flex">
          <p className="mr-2 rounded-lg bg-neutral px-2">{user.username}</p>

          <span className="flex items-center">
            {birthdateToAge(user.birth_date)}
            {user.gender == 'male' ? (
              <PiGenderMaleBold />
            ) : user.gender == 'female' ? (
              <PiGenderFemaleBold />
            ) : (
              <PiGenderIntersexBold />
            )}
          </span>
        </div>

        <div className="mb-5 flex items-center">
          <ul className="flex">
            {user?.gender_preferences.map((gender, index) => (
              <li
                key={index}
                className="mr-2 flex items-center rounded-lg bg-green-2 px-2 py-1"
              >
                <AiFillHeart color="pink" />
                {gender == 'male' ? (
                  <PiGenderMaleBold />
                ) : gender == 'female' ? (
                  <PiGenderFemaleBold />
                ) : (
                  <PiGenderIntersexBold />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!user.me && (
        <div className="font-bold">
          <button
            onClick={() => handleClick()}
            className={`${
              clicked ? ' bg-green-5 active:bg-green-5' : 'bg-green-2'
            } flex items-center rounded-lg border-2 border-brown px-10 py-2 text-xl shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
          >
            Like
            {clicked ? (
              <BiLike className="ml-2"></BiLike>
            ) : (
              <BiSolidLike color="#F39BB3" className="ml-2"></BiSolidLike>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
