'use client';

import { FC } from 'react';
import Link from 'next/link';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import { HiChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';

import { setLike, unsetLike } from '@/api/profile';

interface ProfileButtonsProps {
  user: User;
}

const ProfileButtons: FC<ProfileButtonsProps> = ({ user }) => {
  const handleLike = async () => {
    if (!user.liked) await setLike(user.username);
    else await unsetLike(user.username);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {user.me ? (
        <Link
          href="/profile"
          className="flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <FaUserEdit className="mr-1" />
          Edit profile
        </Link>
      ) : (
        <>
          <button
            onClick={() => void handleLike()}
            className={`${
              user.liked ? 'bg-green-5 active:bg-green-5' : 'bg-green-2'
            } flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
          >
            {!user.liked ? (
              <>
                <BiLike className="mr-1"></BiLike>
                Like
              </>
            ) : (
              <>
                <BiSolidLike color="#F39BB3" className="mr-1" />
                Unlike
              </>
            )}
          </button>

          {user.match && (
            <Link
              href={`/chat/${user.username}`}
              className="flex items-center rounded-lg border-2 border-brown bg-green-5 px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <HiChatBubbleOvalLeftEllipsis className="mr-1" />
              Chat
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileButtons;
