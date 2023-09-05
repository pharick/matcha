'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineClose } from 'react-icons/ai';

interface MainMenuProps {
  currentUser: CurrentUser;
}

const MainMenu: FC<MainMenuProps> = ({ currentUser }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex">
          <li className="shrink-0">
            <Link
              className="block border-r border-brown/30 p-2 transition hover:bg-green-5/50"
              href="/"
            >
              Find love
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              className="block border-r border-brown/30 p-2 transition hover:bg-green-5/50"
              href={`/chat/`}
            >
              Chat
            </Link>
          </li>
          <li className="shrink-0">
            <Link
              className="block p-2 transition hover:bg-green-5/50"
              href={`/users/${currentUser.username}`}
            >
              My profile
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="relative md:hidden">
        {openMenu ? (
          <AiOutlineClose size={30} onClick={() => handleOpenMenu()} />
        ) : (
          <RxHamburgerMenu size={30} onClick={() => handleOpenMenu()} />
        )}
        {openMenu && (
          <ul className="absolute left-[35px] top-0 z-50 w-[150px] rounded-lg bg-green-5/90 text-center font-bold">
            <li className="shrink-0">
              <Link
                onClick={() => handleOpenMenu()}
                className="block border-b border-brown/30 p-2 transition hover:bg-green-5/50"
                href="/"
              >
                Find love
              </Link>
            </li>
            <li className="shrink-0">
              <Link
                onClick={() => handleOpenMenu()}
                className="block border-b border-brown/30 p-2 transition hover:bg-green-5/50"
                href={`/chat/`}
              >
                Chat
              </Link>
            </li>
            <li className="shrink-0">
              <Link
                onClick={() => handleOpenMenu()}
                className="block p-2 transition hover:bg-green-5/50"
                href={`/users/${currentUser.username}`}
              >
                My profile
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default MainMenu;
