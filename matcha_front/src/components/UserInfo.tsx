import { FC } from 'react';
import formatDistance from 'date-fns/formatDistance';

import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
  PiStarFill,
} from 'react-icons/pi';
import { AiFillHeart } from 'react-icons/ai';
import { RiPinDistanceFill } from 'react-icons/ri';
import { birthdateToAge } from '@/helpers';

interface UserInfoProps {
  user: User;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  return (
    <>
      <div className="mb-1 flex flex-wrap items-center justify-end">
        {user.last_online && (
          <p
            className={`rounded px-1 text-sm text-white ${
              user.online ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {user.online
              ? 'Online'
              : `${formatDistance(new Date(user.last_online), new Date())} ago`}
          </p>
        )}
        <div className="ml-2 flex items-baseline">
          <h1 className="mr-2 text-right text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h1>
          <div className="flex items-center text-xl">
            {birthdateToAge(user.birth_date)}
            {user.gender == 'male' ? (
              <PiGenderMaleBold />
            ) : user.gender == 'female' ? (
              <PiGenderFemaleBold />
            ) : (
              <PiGenderIntersexBold />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-y-1">
        <p className="rounded-lg bg-neutral px-2">{user.username}</p>
        {!user.me && (
          <p className="ml-1 flex items-center rounded-lg bg-neutral px-2">
            <RiPinDistanceFill className="mr-1" />
            {(user.distance / 1000).toFixed(0)}km
          </p>
        )}
        {user.rating > 0 && (
          <p className="ml-1 flex items-center rounded-lg bg-neutral px-2">
            <PiStarFill className="mr-1" /> {user.rating.toFixed(1)}
          </p>
        )}

        <ul className="ml-1 flex flex-wrap items-center justify-end">
          {user?.gender_preferences.map((gender, index) => (
            <li
              key={index}
              className="mr-1 flex items-center rounded-lg bg-green-2 px-2 py-1 last:mr-0"
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
    </>
  );
};

export default UserInfo;
