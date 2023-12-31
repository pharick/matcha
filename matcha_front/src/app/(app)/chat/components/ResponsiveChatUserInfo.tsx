import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import formatDistance from 'date-fns/formatDistance';
import { AiOutlineArrowLeft } from 'react-icons/ai';

interface ResponsiveChatUserInfo {
  user: User;
}

const ResponsiveChatUserInfo: FC<ResponsiveChatUserInfo> = ({ user }) => {
  return (
    <div className="flex items-center justify-between gap-1 border border-transparent border-b-brown bg-neutral/30 px-5 py-1">
      <Link href="/chat">
        <AiOutlineArrowLeft size={30} />
      </Link>
      <div className="ml-2">
        <div className="mb-1 flex justify-center">
          <p className="text-sm font-bold sm:text-lg">
            <Link href={`/users/${user.username}`}>
              {user.first_name} {user.last_name}
            </Link>
          </p>
        </div>
        <div className="flex justify-center text-xs">
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
      <Link href={`/users/${user.username}`} className="hidden sm:block">
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
    </div>
  );
};

export default ResponsiveChatUserInfo;
