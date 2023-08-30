import { FC } from 'react';
import Link from 'next/link';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';

import UserPhoto from './UserPhoto';
import ProfileVisitor from './ProfileVisitor';
import { setLike, unsetLike } from '@/api/profile';

interface UserProfileProps {
  user: User;
  photos: Photo[];
}

const UserProfile: FC<UserProfileProps> = ({ user, photos }) => {
  const handleLike = async () => {
    'use server';
    if (!user.liked) await setLike(user.username);
    else await unsetLike(user.username);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const handleStartConversation = async () => {
    'use server';
    console.log('start');
  };

  return (
    <main className="mx-auto my-5 flex flex-wrap justify-center">
      <ProfileVisitor username={user.username} />

      <div className="mr-5 w-[500px]">
        <div className="mb-2 h-[500px]">
          <UserPhoto user={user} photos={photos} />
        </div>

        <div className="mb-5 flex items-center justify-end">
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
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form action={handleLike}>
                <button
                  type="submit"
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
                      <BiSolidLike
                        color="#F39BB3"
                        className="mr-1"
                      ></BiSolidLike>
                      Unlike
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="relative min-w-[500px] flex-1">
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
        <div className="absolute bottom-0 right-0 mb-5 flex">
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form action={handleStartConversation}>
            <button
              type="submit"
              className={`${
                user.liked ? 'bg-green-5 active:bg-green-5' : 'bg-green-2'
              } flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
            >
              Block User
            </button>
          </form>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form action={handleStartConversation}>
            <button
              type="submit"
              className={`${
                user.liked ? 'bg-green-5 active:bg-green-5' : 'bg-green-2'
              } flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
            >
              Report as fake
            </button>
          </form>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form action={handleStartConversation}>
            <button
              type="submit"
              className={`${
                user.liked ? 'bg-green-5 active:bg-green-5' : 'bg-green-2'
              } flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
