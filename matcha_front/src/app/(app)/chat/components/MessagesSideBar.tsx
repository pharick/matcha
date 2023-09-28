import UserSideBar from './UserSideBar';

import Link from 'next/link';
import { FC } from 'react';

interface MessagesSideBarProps {
  className?: string;
  chats: User[];
}

const MessagesSideBar: FC<MessagesSideBarProps> = ({ className, chats }) => {
  return (
    <div
      className={`h-full w-full border-transparent border-r-brown bg-neutral/30 lg:w-[450px] lg:border ${
        className ?? ''
      }`}
    >
      {chats && chats.length > 0 ? (
        <ul className="rounded-lg">
          {chats.map((u: User) => (
            <li
              key={u.id}
              className="flex h-[70px] items-center border-b border-brown/50 bg-green-5/50 px-5"
            >
              <Link className="block w-full" href={`/chat/${u.username}`}>
                <UserSideBar user={u} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col justify-center pt-10">
          <p className="text-center font-bold">
            You don&apos;t have any users to chat with
          </p>
          <Link
            className="block text-center underline hover:opacity-80"
            href="/search"
          >
            Find your next match
          </Link>
        </div>
      )}
    </div>
  );
};

export default MessagesSideBar;
