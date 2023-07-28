'use client';

import { FC } from 'react';

import { User } from '../../../../types';
import UserPhoto from './UserPhoto';
import UserInfo from './UserInfo';

interface UserProfileProps {
  user: User;
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="mx-auto mt-10 max-w-[700px]">
      <div className="mb-10 flex max-w-[700px] flex-wrap justify-center">
        <div className="m-right-2 h-[400px] w-[400px]">
          <UserPhoto username={user.username} />
        </div>
        <div className="flex max-w-[400px] flex-1">
          {user && <UserInfo user={user} />}
        </div>
      </div>
      <div className="mx-auto max-w-[700px]">
        <h1 className="mb-5 text-xl font-bold underline">Biography</h1>
        <div className="mb-5 rounded-lg bg-neutral/50 p-3">
          {user?.biography}
        </div>
        <h1 className="mb-5 text-xl font-bold underline">Interests</h1>
        <div className="flex flex-wrap">
          <ul>
            {user?.tags.map((tag, i) => (
              <li key={i} className="mb-5 mr-2 rounded-lg bg-green-2 px-2">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
