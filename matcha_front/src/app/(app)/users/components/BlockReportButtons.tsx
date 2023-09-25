'use client';

import { FC } from 'react';
import { BiBlock } from 'react-icons/bi';
import { MdReportGmailerrorred } from 'react-icons/md';

import { blockUser, unblockUser, reportUser } from '@/api/profile';

interface BlockReportButtonsProps {
  user: User;
}

const BlockReportButtons: FC<BlockReportButtonsProps> = ({ user }) => {
  const handleBlock = async () => {
    if (!user.blocked) await blockUser(user.username);
    else await unblockUser(user.username);
  };

  return (
    <div className="flex justify-center gap-1 lg:justify-end">
      <button
        onClick={() => void handleBlock()}
        className="flex items-center rounded-lg border-2 border-brown bg-red-500/50 px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        {!user.blocked ? (
          <>
            <BiBlock className="mr-1" />
            Block User
          </>
        ) : (
          <>
            <BiBlock className="mr-1" />
            Unblock user
          </>
        )}
      </button>
      <button
        onClick={() => void reportUser(user.username)}
        disabled={user.reported}
        className={`${
          user.reported
            ? 'bg-gray-400 text-red-900'
            : 'bg-green-2 hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
        } flex items-center rounded-lg border-2 border-brown  px-3 py-2 text-lg shadow-md`}
      >
        <MdReportGmailerrorred className="mr-1" />
        {!user.reported ? 'Report as fake' : 'You reported user as fake'}
      </button>
    </div>
  );
};

export default BlockReportButtons;
