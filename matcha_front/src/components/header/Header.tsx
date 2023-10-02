import { FC } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import Cup from '@/images/cup.svg';
import Matcha from '@/images/Matcha.svg';
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
      <div className="w-max-screen mb-5 mt-3 flex items-center justify-between">
        <div className="mr-3 lg:hidden">
          <MainMenu currentUser={currentUser} />
        </div>

        <div className="flex shrink-0 cursor-pointer items-center">
          <Link href="/" className="hidden items-center md:flex">
            <Image src={Matcha as StaticImageData} width={100} alt="logo" />
            <Image
              src={Cup as StaticImageData}
              width={80}
              alt="cup"
              className="mr-2"
            />
          </Link>

          <div className="hidden lg:block">
            <MainMenu currentUser={currentUser} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <Notifications user={currentUser} className="mr-3" />
          <UserWidget currentUser={currentUser} />
        </div>
      </div>

      <PositionUpdater />
    </header>
  );
};

export default Header;
