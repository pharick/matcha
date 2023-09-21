'use client';

import { getAllChats } from '@/api/chat';
import ShortUserInfo from '@/components/main/ShortUserInfo';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

const MessagesSideBar: FC = () => {
  const [chatUsers, setChatUsers] = useState<User[]>([]);

  const getChatUsers = async () => {
    const res = await getAllChats();
    setChatUsers(res);
  };

  useEffect(() => {
    void getChatUsers();
  }, []);

  useEffect(() => {
    void getChatUsers();
  }, [chatUsers]);

  return (
    <div className="w-[400px] border border-transparent border-r-brown bg-neutral/30">
      {chatUsers && (
        <ul className="min-h-[430px] rounded-lg">
          {chatUsers.map((u: User) => (
            <li
              key={u.id}
              className="flex h-[70px] items-center border-b border-brown/50 bg-green-5/50 px-5"
            >
              <Link href={`/${u.username}`}>
                <ShortUserInfo user={u} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesSideBar;
