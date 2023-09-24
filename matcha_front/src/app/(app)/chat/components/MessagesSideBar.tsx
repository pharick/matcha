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
    <div className="h-full w-full border-transparent border-r-brown bg-neutral/30 lg:w-[450px] lg:border">
      {chatUsers && (
        <ul className="rounded-lg">
          {chatUsers.map((u: User) => (
            <li
              key={u.id}
              className="flex h-[70px] items-center border-b border-brown/50 bg-green-5/50 px-5"
              onClick={onClick}
            >
              <Link href={`/chat/${u.username}`}>
                <UserSideBar user={u} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesSideBar;
