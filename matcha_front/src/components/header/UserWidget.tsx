import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import DefaultProfilePicture from '@/images/default_profile_picture.jpg';
import { logout } from '@/api/auth';

interface UserWidgetProps {
  currentUserPromise: Promise<CurrentUser | undefined>;
}

const UserWidget: FC<UserWidgetProps> = async ({ currentUserPromise }) => {
  const currentUser = await currentUserPromise;
  if (!currentUser) redirect('/login');

  return (
    <div className="group relative flex cursor-pointer items-center">
      <p className="mr-1 text-lg">{currentUser.username}</p>
      <figure className="relative h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-brown">
        <Image
          src={
            currentUser.avatar
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${currentUser.avatar}`
              : DefaultProfilePicture
          }
          fill={true}
          className="object-cover"
          sizes="100px"
          alt="photo"
        />
      </figure>

      <nav className="absolute right-0 top-full z-50 hidden min-w-max rounded-xl bg-green-5/90 text-center font-bold group-hover:block">
        <Link
          className="block rounded-t-xl border-b border-brown/50 p-2 hover:bg-brown hover:text-white"
          href="/profile"
        >
          Profile settings
        </Link>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form action={logout}>
          <button
            className="block w-full rounded-b-xl p-2 hover:bg-brown hover:text-white"
            type="submit"
          >
            Log Out
          </button>
        </form>
      </nav>
    </div>
  );
};

export default UserWidget;
