import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

const ChatUserInfo: FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex items-center border border-transparent border-b-brown bg-neutral/30 px-5 py-1">
      <Link href={`/users/${user.username}`}>
        <figure className="relative h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-brown hover:border-brown/70">
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
      </Link>
      <div className="ml-2">
        <div className="mb-1 flex">
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
          <p className="mr-2 rounded-lg bg-neutral px-1">{user.username}</p>
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

export default ChatUserInfo;
