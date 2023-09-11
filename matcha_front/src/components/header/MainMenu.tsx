'use client';

import { FC, ReactNode, useState } from 'react';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineClose } from 'react-icons/ai';
// import { HiOutlineHome } from 'react-icons/hi';

interface MainMenuItemProps {
  children: ReactNode;
  isBurger: boolean;
  href: string;
  onClick?: () => void;
}

const MainMenuItem: FC<MainMenuItemProps> = ({
  children,
  isBurger,
  onClick,
  href,
}) => {
  return (
    <li className="shrink-0">
      <Link
        className={`block ${
          isBurger ? 'border-b' : 'border-r'
        } border-brown/30 p-2 transition hover:bg-green-5/50`}
        href={href}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
};

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
          <MainMenuItem isBurger={false} href="/">
            Home
          </MainMenuItem>
          <MainMenuItem isBurger={false} href="/search">
            Find Love
          </MainMenuItem>
          <MainMenuItem isBurger={false} href={`/chat/`}>
            Chat
          </MainMenuItem>
          <li className="shrink-0">
            <Link
              className="flex items-center p-2 transition hover:bg-green-5/50"
              href={`/users/${currentUser.username}`}
            >
              {/* Home */}
              {/* <HiOutlineHome size={25} className="mr-2" /> */}
              My Profile
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="md:hidden">
        {openMenu ? (
          <AiOutlineClose size={30} onClick={() => handleOpenMenu()} />
        ) : (
          <RxHamburgerMenu size={30} onClick={() => handleOpenMenu()} />
        )}
        <ul
          className={`absolute left-0 top-[86px] z-50 h-screen w-[250px] rounded-r-lg bg-green-5/90 text-center font-bold ${
            openMenu
              ? 'easy-in-out translate-x-0 duration-500'
              : 'easy-in-out -translate-x-full duration-500'
          }
        `}
        >
          <MainMenuItem
            isBurger={true}
            href="/"
            onClick={() => handleOpenMenu()}
          >
            Home
          </MainMenuItem>
          <MainMenuItem
            isBurger={true}
            href="/search"
            onClick={() => handleOpenMenu()}
          >
            Find Love
          </MainMenuItem>
          <MainMenuItem
            isBurger={true}
            href={`/chat/`}
            onClick={() => handleOpenMenu()}
          >
            Chat
          </MainMenuItem>
          <MainMenuItem
            isBurger={true}
            href={`/users/${currentUser.username}`}
            onClick={() => handleOpenMenu()}
          >
            My profile
          </MainMenuItem>
        </ul>
      </nav>
    </>
  );
};

export default MainMenu;
