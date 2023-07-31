'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';

import DefaultProfilePicture from '@/images/default_profile_picture.jpg';

interface UserProfileProps {
  photos: Photo[];
}

const UserPhoto: FC<UserProfileProps> = ({ photos }) => {
  const [photoId, setPhotoId] = useState<number>(0);

  return (
    <div className="relative h-full w-full overflow-auto rounded-lg border-2 border-brown">
      {photoId > 0 && (
        <button
          className="group absolute left-0 top-0 block h-full px-1 hover:bg-green-5/50"
          onClick={() => setPhotoId(photoId - 1)}
        >
          <div className="rounded bg-green-5/50 group-hover:bg-transparent">
            <BiLeftArrowAlt size={20} />
          </div>
        </button>
      )}
      <figure className="relative -z-50 h-full overflow-hidden">
        <Image
          src={
            photos[photoId]
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${photos[photoId].url}`
              : DefaultProfilePicture
          }
          fill={true}
          className="object-cover"
          sizes="300px"
          alt="photo"
        />
      </figure>
      {photoId + 1 < photos.length && (
        <button
          className="group absolute right-0 top-0 block h-full px-1 hover:bg-green-5/50"
          onClick={() => setPhotoId(photoId + 1)}
        >
          <div className="rounded bg-green-5/50 group-hover:bg-transparent">
            <BiRightArrowAlt size={20} />
          </div>
        </button>
      )}
    </div>
  );
};

export default UserPhoto;
