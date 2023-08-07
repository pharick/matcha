'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';

import DefaultProfilePicture from '@/images/default_profile_picture.jpg';
import UserInfo from './UserInfo';

interface UserProfileProps {
  user: User;
  photos: Photo[];
}

const UserPhoto: FC<UserProfileProps> = ({ user, photos }) => {
  const [photoId, setPhotoId] = useState<number>(0);

  return (
    <div className="relative h-full w-full rounded-lg border-2 border-brown bg-brown">
      {photoId > 0 && (
        <button
          className="group absolute left-0 top-0 z-30 block h-full px-1 hover:bg-green-5/50"
          onClick={() => setPhotoId(photoId - 1)}
        >
          <div className="rounded bg-green-5/50 group-hover:bg-transparent">
            <BiLeftArrowAlt size={20} />
          </div>
        </button>
      )}
      <figure className="relative z-20 h-full overflow-hidden">
        <Image
          src={
            photos[photoId]
              ? `${process.env.NEXT_PUBLIC_BACK_BASE_URL}${photos[photoId].url}`
              : DefaultProfilePicture
          }
          fill={true}
          className="rounded-lg object-cover"
          sizes="300px"
          alt="photo"
        />
      </figure>
      {photoId + 1 < photos.length && (
        <button
          className="group absolute right-0 top-0 z-30 block h-full px-1 hover:bg-green-5/50"
          onClick={() => setPhotoId(photoId + 1)}
        >
          <div className="rounded bg-green-5/50 group-hover:bg-transparent">
            <BiRightArrowAlt size={20} />
          </div>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-40 rounded-b-lg p-3 shadow-[inset_0_-100px_60px_20px_rgba(255,255,255,0.4)]">
        <UserInfo user={user} />
      </div>
    </div>
  );
};

export default UserPhoto;
