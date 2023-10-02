'use client';

import { FC } from 'react';
import Image from 'next/image';
import { formatDistance } from 'date-fns';

interface UserSideBarProps {
  user: User;
}

const UserSideBar: FC<UserSideBarProps> = ({ user }) => {
  return (
    <div className="my-1 flex flex-wrap items-center border border-transparent sm:px-1 sm:py-1">
      <figure className="relative hidden h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-brown sm:block">
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
        <div className="mb-1 flex flex-wrap">
          <p className="rounded-lg pr-2 font-bold">
            {user.first_name} {user.last_name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <p className="rounded-lg bg-neutral px-1">{user.username}</p>
          {user.last_online && (
            <p
              className={`w-fit rounded-lg px-1  text-neutral ${
                user.online ? 'bg-green-500' : 'bg-red-500/50'
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

export default UserSideBar;
