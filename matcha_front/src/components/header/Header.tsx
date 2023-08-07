import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Cup from '@/images/cup.png';
import Matcha from '@/images/Matcha.png';
import PositionUpdater from '../PositionUpdater';
import UserWidget from './UserWidget';
import MainMenu from './MainMenu';
import Notifications from './Notifications';

interface HeaderProps {
  currentUser: CurrentUser;
}

const Header: FC<HeaderProps> = ({ currentUser }) => {
  return (
    <header>
      <div className="mb-5 mt-3 flex justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src={Matcha} width={100} priority alt="logo" />
            <Image src={Cup} width={80} alt="cup" className="mr-2" />
          </Link>

          <MainMenu currentUser={currentUser} />
        </div>

        <div className="flex items-center">
          <Notifications className="mr-3" />

          <UserWidget currentUser={currentUser} />
        </div>
      </div>

      <PositionUpdater />
    </header>
  );
};

export default Header;
