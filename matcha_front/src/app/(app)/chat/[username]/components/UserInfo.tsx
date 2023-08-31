import { FC } from 'react';
import Image from 'next/image';
import formatDistance from 'date-fns/formatDistance';

import { birthdateToAge } from '@/helpers';
import {
  PiGenderFemaleBold,
  PiGenderIntersexBold,
  PiGenderMaleBold,
} from 'react-icons/pi';

interface UserInfoProps {
  user: User;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex h-[70px] items-center border border-transparent border-b-brown bg-neutral/30 px-5">
      <figure className="relative h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-brown">
        <Image
          src={
            user.avatar.startsWith('http')
              ? user.avatar
              : `${process.env.NEXT_PUBLIC_BACK_BASE_URL}${user.avatar}`
          }
          fill={true}
          className="object-cover"
          sizes="30px"
          alt="photo"
        />
      </figure>
      <div className="ml-2">
        <div className="mb-2 flex">
          <p className="rounded-lg pr-2 font-bold">
            {user.first_name} {user.last_name}
          </p>
          <div className="flex items-center">
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
        <div className="flex items-center text-sm">
            <p className="bg-neutral px-1 rounded-lg mr-2">{user.username}</p>
          {user.last_online && (
            <p
              className={`w-fit rounded-lg px-1  text-neutral ${
                user.online ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {user.online
                ? 'Online'
                : `${formatDistance(
                    new Date(user.last_online),
                    new Date()
                  )} ago`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
