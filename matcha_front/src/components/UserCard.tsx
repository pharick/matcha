import { FC } from 'react';
import Image, { StaticImageData } from 'next/image';

import DefaultProfilePicture from '@/images/default_profile_picture.svg';
import UserInfo from './UserInfo';
import Link from 'next/link';

interface UserCardProps {
  user: User;
  avatar: string;
}

const UserCard: FC<UserCardProps> = ({ user, avatar }) => {
  return (
    <div className="group relative h-full w-full cursor-pointer rounded-lg border-2 border-brown bg-brown hover:-translate-x-px hover:-translate-y-px hover:shadow-lg">
      <figure className="relative z-20 h-full overflow-hidden">
        <Image
          src={
            avatar && avatar.startsWith('http')
              ? avatar
              : avatar
              ? `${process.env.NEXT_PUBLIC_BACK_BASE_URL}${avatar}`
              : (DefaultProfilePicture as StaticImageData)
          }
          fill={true}
          className="rounded-lg object-cover"
          sizes="500px"
          alt="photo"
        />
      </figure>

      <Link
        href={`/users/${user.username}`}
        className="absolute top-0 z-40 hidden h-full w-full items-center justify-center rounded-lg bg-white/30 font-bold group-hover:flex"
      >
        See more
      </Link>

      <div className="absolute bottom-0 left-0 right-0 top-0 z-30 flex flex-col justify-end rounded-b-lg p-3 shadow-[inset_0_-200px_80px_-100px_rgba(255,255,255,0.6)]">
        <UserInfo user={user} />
      </div>
    </div>
  );
};

export default UserCard;
