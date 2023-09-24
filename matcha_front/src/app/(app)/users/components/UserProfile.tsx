import { FC } from 'react';

import UserPhoto from './UserPhoto';
import ProfileVisitor from './ProfileVisitor';
import ProfileButtons from './ProfileButtons';
import BlockReportButtons from './BlockReportButtons';

interface UserProfileProps {
  user: User;
  photos: Photo[];
}

const UserProfile: FC<UserProfileProps> = ({ user, photos }) => {
  return (
    <main className="mx-auto mb-5 flex flex-col flex-wrap justify-center lg:flex-row">
      <ProfileVisitor username={user.username} />

      <div className="mx-auto mb-2 w-[500px] lg:m-0 lg:mr-5">
        <div className="mb-2 h-[500px]">
          <UserPhoto user={user} photos={photos} />
        </div>

        <ProfileButtons user={user} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="mb-8">
          <h2 className="mb-5 border-b-2 border-brown pb-1 text-xl text-brown">
            Biography
          </h2>
          <div className="mb-5 rounded-lg bg-neutral/50 p-3">
            {user?.biography || 'No bio available'}
          </div>
          <h2 className="mb-5 border-b-2 border-brown pb-1 text-xl text-brown">
            Interests
          </h2>
          {user?.tags.length > 0 ? (
            <div>
              <ul className="flex flex-wrap gap-2">
                {user?.tags.map((tag, i) => (
                  <li key={i} className="rounded-lg bg-green-2 px-2 text-white">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            'No tags available'
          )}
        </div>

        <BlockReportButtons user={user} />
      </div>
    </main>
  );
};

export default UserProfile;
