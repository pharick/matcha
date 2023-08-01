import { FC } from 'react';
import Link from 'next/link';

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

export default MainMenu;
