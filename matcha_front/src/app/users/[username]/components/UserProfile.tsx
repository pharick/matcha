import { FC } from 'react';

import UserPhoto from './UserPhoto';
import UserInfo from './UserInfo';

interface UserProfileProps {
  user: User;
  photosPromise: Promise<Photo[]>;
}

const UserProfile: FC<UserProfileProps> = async ({ user, photosPromise }) => {
  const photos = await photosPromise;

  return (
    <main className="mx-auto mt-10 max-w-[700px]">
      <header className="mb-10 flex max-w-[700px] flex-wrap justify-center">
        <div className="m-right-2 mr-3 h-[400px] w-[400px]">
          <UserPhoto photos={photos} />
        </div>
        <div className="flex max-w-[400px] flex-1 pt-2">
          <UserInfo user={user} />
        </div>
      </header>

      <div className="mx-auto max-w-[700px]">
        <h2 className="my-5 border-b-2 border-brown pb-1 text-xl text-brown">
          Biography
        </h2>
        <div className="mb-5 rounded-lg bg-neutral/50 p-3">
          {user?.biography}
        </div>
        <h2 className="my-5 border-b-2 border-brown pb-1 text-xl text-brown">
          Interests
        </h2>
        <div className="flex flex-wrap">
          <ul className="flex">
            {user?.tags.map((tag, i) => (
              <li key={i} className="mb-5 mr-2 rounded-lg bg-green-2 px-2">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
