'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Cup from '@/images/cup.png';
import DefaultProfilePicture from '@/images/default_profile_picture.jpg';
import Matcha from '@/images/Matcha.png';
import { logout } from '@/api/auth';
import PositionUpdater from './PositionUpdater';

interface UserWidgetProps {
  user: CurrentUser;
}

const UserWidget: FC<UserWidgetProps> = ({ user }) => {
  return (
    <div className="group relative flex cursor-pointer items-center">
      <p className="mr-1 text-lg">{user.username}</p>
      <figure className="relative h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-brown">
        <Image
          src={
            user.avatar
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.avatar}`
              : DefaultProfilePicture
          }
          fill={true}
          className="object-cover"
          sizes="100px"
          alt="photo"
        />
      </figure>

      <nav className="absolute right-0 top-full z-50 hidden min-w-max rounded-xl bg-green-5/80 text-center font-bold group-hover:block">
        <Link
          className="block rounded-t-xl border-b border-brown/50 p-2 hover:bg-brown hover:text-white"
          href="/profile"
        >
          Profile settings
        </Link>
        <button
          className="block w-full rounded-b-xl p-2 hover:bg-brown hover:text-white"
          onClick={() => logout()}
        >
          Log Out
        </button>
      </nav>
    </div>
  );
};

interface MainMenuProps {
  user: CurrentUser;
}

const MainMenu: FC<MainMenuProps> = ({ user }) => {
  return (
    <nav>
      <ul className="flex">
        <li>
          <Link
            className="border-r border-brown p-2 hover:bg-green-5/50"
            href={`/search`}
          >
            Find love
          </Link>
        </li>
        <li>
          <Link
            className="p-2 hover:bg-green-5/50"
            href={`/users/${user.username}`}
          >
            My profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

interface HeaderProps {
  user: CurrentUser;
}

const Header: FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <div className="mb-5 mt-3 flex justify-between">
        <div className="flex items-center">
          <Image src={Matcha} width={100} priority alt="logo" />
          <Image src={Cup} width={80} alt="cup" className="mr-2" />

          <MainMenu user={user} />
        </div>

        <UserWidget user={user} />
      </div>

      <PositionUpdater />
    </header>
  );
};

export default Header;
