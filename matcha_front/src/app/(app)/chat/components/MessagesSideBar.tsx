'use client';

import { getAllChats } from '@/api/chat';
import UserSideBar from './UserSideBar';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

interface MessagesSideBarProps {
  onClick?: () => void;
}

const MessagesSideBar: FC<MessagesSideBarProps> = ({ onClick }) => {
  const [chatUsers, setChatUsers] = useState<User[]>([]);

  const getChatUsers = async () => {
    const res = await getAllChats();
    setChatUsers(res);
  };

  useEffect(() => {
    void getChatUsers();
  }, []);

  return (
    <div className="w-full border-transparent border-r-brown bg-neutral/30 lg:w-[400px] lg:border">
      {chatUsers.length > 0 ? (
        <ul className="rounded-lg">
          {chatUsers.map((u: User) => (
            <li
              key={u.id}
              className="flex h-[70px] items-center border-b border-brown/50 bg-green-5/50 px-5"
              onClick={onClick}
            >
              <Link className="block w-full" href={`/chat/${u.username}`}>
                <UserSideBar user={u} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col justify-center">
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
