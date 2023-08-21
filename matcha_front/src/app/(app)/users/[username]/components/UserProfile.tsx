import { FC } from 'react';
import Link from 'next/link';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import Image, { StaticImageData } from 'next/image';

import UserPhoto from './UserPhoto';
import ProfileVisitor from './ProfileVisitor';
import { setLike, unsetLike } from '@/api/profile';
import Match from '@/images/Match.svg';

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
              {user.match && (
                <Image
                  src={Match as StaticImageData}
                  alt="match"
                  width={80}
                  className="m-5"
                />
              )}
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

      <div className="min-w-[500px] flex-1">
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
            <ul className="flex flex-wrap">
              {user?.tags.map((tag, i) => (
                <li
                  key={i}
                  className="mb-5 mr-2 rounded-lg bg-green-2 px-2 text-white"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          'No tags available'
        )}
        <button className="block self-end">Report</button>
      </div>
    </main>
  );
};

export default UserProfile;
