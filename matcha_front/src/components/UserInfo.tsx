import { FC } from 'react';
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
      <div className="mb-1 flex items-baseline justify-end">
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

      <div className="mb-1 flex items-center justify-end">
        <p className="mr-1 rounded-lg bg-neutral px-2">{user.username}</p>
        <p className="mr-1 flex items-center rounded-lg bg-neutral px-2">
          <RiPinDistanceFill className="mr-1" />
          {(user.distance / 1000).toFixed(0)}km
        </p>
        {user.rating > 0 && (
          <p className="flex items-center rounded-lg bg-neutral px-2">
            <PiStarFill className="mr-1" /> {user.rating.toFixed(1)}
          </p>
        )}
      </div>
      <ul className="flex items-center justify-end">
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
    </>
  );
};

export default UserInfo;
