import { FC } from 'react';
import { notFound } from 'next/navigation';

import UserPhoto from './UserPhoto';
import UserInfo from './UserInfo';
import ProfileVisitor from './ProfileVisitor';

interface UserProfileProps {
  userPromise: Promise<User | undefined>;
  photosPromise: Promise<Photo[] | undefined>;
}

const UserProfile: FC<UserProfileProps> = async ({
  userPromise,
  photosPromise,
}) => {
  const [user, photos] = await Promise.all([userPromise, photosPromise]);
  if (!user || !photos) notFound();

  return (
    <main className="mx-auto my-5 max-w-[700px]">
      <ProfileVisitor username={user.username} />

      <header className="mb-10 flex flex-wrap justify-center">
        <div className="m-right-2 mr-3 w-[400px] h-[400px]">
          <UserPhoto photos={photos} />
        </div>
        <div className="flex-1 pt-2">
          <UserInfo user={user} />
        </div>
      </header>

      <div className="mx-auto max-w-[700px]">
        <h2 className="my-5 border-b-2 border-brown pb-1 text-xl text-brown">
          Biography
        </h2>
        <div className="mb-5 rounded-lg bg-neutral/50 p-3">
          {user?.biography || 'No bio available'}
        </div>
        <h2 className="my-5 border-b-2 border-brown pb-1 text-xl text-brown">
          Interests
        </h2>
        {user?.tags.length > 0 ? (
          <div>
            <ul className="flex flex-wrap">
              {user?.tags.map((tag, i) => (
                <li key={i} className="mb-5 mr-2 rounded-lg bg-green-2 px-2">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          'No tags available'
        )}
      </div>
    </main>
  );
};

export default UserProfile;
