import { FC } from 'react';
import Image, { StaticImageData } from 'next/image';

import DefaultProfilePicture from '@/images/default_profile_picture.svg';
import UserInfo from './UserInfo';
import Link from 'next/link';

interface UserCardProps {
  user: User;
  searchTags: string[];
}

const UserCard: FC<UserCardProps> = ({ user, searchTags }) => {
  const mutualTags = user.tags.filter((tag) => searchTags.includes(tag));

  return (
    <Link href={`/users/${user.username}`}>
      <article className="group relative h-full w-full overflow-hidden rounded-lg border-2 border-brown bg-brown transition hover:shadow-lg">
        <figure className="relative z-20 h-full overflow-hidden">
          <Image
            src={
              user.avatar && user.avatar.startsWith('http')
                ? user.avatar
                : user.avatar
                ? `${process.env.NEXT_PUBLIC_BACK_BASE_URL}${user.avatar}`
                : (DefaultProfilePicture as StaticImageData)
            }
            fill={true}
            className="object-cover"
            sizes="500px"
            alt="photo"
          />
        </figure>

        <div className="absolute bottom-0 left-0 right-0 top-0 z-30 flex flex-col justify-end rounded-b-lg p-3 shadow-[inset_0_-250px_80px_-100px_rgba(255,255,255,0.6)]">
          {mutualTags.length > 0 && (
            <ul className="mb-1 flex flex-wrap justify-end gap-1 opacity-0 transition group-hover:opacity-100">
              {mutualTags.map((tag, i) => (
                <li key={i} className="rounded-lg bg-green-2 px-2 text-white">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <UserInfo user={user} />
        </div>

        <div className="absolute left-2 top-2 z-30 rounded-lg bg-white/50 px-1">
          {mutualTags.length} mutual{' '}
          {mutualTags.length == 1 ? 'interest' : 'interests'}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
