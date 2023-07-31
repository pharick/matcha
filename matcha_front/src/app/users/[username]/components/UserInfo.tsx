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
    <div className="w-full font-bold">
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
  );
};

export default UserInfo;
