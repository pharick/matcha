'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SecondaryMenuProps {
  items: MenuItem[];
}

const SecondaryMenu: FC<SecondaryMenuProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <ul className="mb-4 flex border-b border-brown font-bold">
      {items.map(({ title, url }, i) => (
        <li key={i} className="flex-1 border-r border-brown/30 last:border-r-0">
          <Link
            href={url}
            className={`flex h-full w-full items-center justify-center bg-green-1 p-2 text-center font-bold transition ${
              pathname.startsWith(url) ? 'bg-green-2/50' : 'hover:bg-neutral/50'
            }`}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SecondaryMenu;
