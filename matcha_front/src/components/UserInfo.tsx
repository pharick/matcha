import { FC } from 'react';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';
import { AiFillHeart } from 'react-icons/ai';
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

      <div className="flex items-center justify-end">
        <p className="ml-auto w-fit rounded-lg bg-neutral px-2">
          {user.username}
        </p>
        <ul className="flex">
          {user?.gender_preferences.map((gender, index) => (
            <li
              key={index}
              className="ml-2 flex items-center rounded-lg bg-green-2 px-2 py-1"
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
