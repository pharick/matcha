import { FC } from 'react';
import Link from 'next/link';

interface MainMenuProps {
  currentUser: CurrentUser;
}

const MainMenu: FC<MainMenuProps> = ({ currentUser }) => {
  return (
    <nav>
      <ul className="flex">
        <li className="shrink-0">
          <Link
            className="block border-r border-brown p-2 transition hover:bg-green-5/50"
            href="/"
          >
            Find love
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
  );
};

export default MainMenu;
