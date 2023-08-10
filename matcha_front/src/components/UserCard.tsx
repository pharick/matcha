import { FC, useState } from 'react';
import Image, { StaticImageData } from 'next/image';

import DefaultProfilePicture from '@/images/default_profile_picture.svg';
import UserInfo from './UserInfo';
import Link from 'next/link';

interface UserCardProps {
  user: User;
  avatar: string;
}

const UserCard: FC<UserCardProps> = ({ user, avatar }) => {
  const [hovered, setHovered] = useState<boolean>(false);

  // const handleOpenUserProfile = () => {

  // }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-full w-full cursor-pointer rounded-lg border-2 border-brown bg-brown"
    >
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
          sizes="300px"
          alt="photo"
        />
      </figure>

      {hovered && (
        <Link
          href={`/users/${user.username}`}
          className="absolute top-0 z-40 flex h-full w-full items-center justify-center rounded-lg bg-white/30 font-bold"
        >
          See more
        </Link>
      )}

      <div className="absolute bottom-0 left-0 right-0 top-0 z-30 flex flex-col justify-end rounded-b-lg p-3 shadow-[inset_0_-200px_80px_-100px_rgba(255,255,255,0.6)]">
        <UserInfo user={user} />
      </div>
    </div>
  );
};

export default UserCard;
