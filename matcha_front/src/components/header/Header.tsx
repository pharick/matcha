'use client';

import { FC } from 'react';
import Image from 'next/image';

import Cup from '@/images/cup.png';
import Matcha from '@/images/Matcha.png';
import PositionUpdater from '../PositionUpdater';
import UserWidget from './UserWidget';
import MainMenu from './MainMenu';
import Notifications from './Notifications';

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

        <Notifications />
        <UserWidget user={user} />
      </div>

      <PositionUpdater />
    </header>
  );
};

export default Header;