import { FC } from 'react';
import Link from 'next/link';

interface MainMenuProps {
  currentUserPromise: Promise<CurrentUser | undefined>;
}

const MainMenu: FC<MainMenuProps> = async ({ currentUserPromise }) => {
  const user = await currentUserPromise;

  return (
    <nav>
      <ul className="flex">
        <li className="shrink-0">
          <Link
            className="block border-r border-brown p-2 hover:bg-green-5/50"
            href={`/search`}
          >
            Find love
          </Link>
        </li>
        <li className="shrink-0">
          <Link
            className="block p-2 hover:bg-green-5/50"
            href={`/users/${user?.username}`}
          >
            My profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;
