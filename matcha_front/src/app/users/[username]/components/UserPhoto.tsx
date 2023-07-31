'use client';

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';

import DefaultProfilePicture from '@/images/default_profile_picture.jpg';

interface UserProfileProps {
  username: string;
}

const UserPhoto: FC<UserProfileProps> = ({ username }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoId, setPhotoId] = useState<number>(0);

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const getUser = async () => {
      const requestOptions = {
        headers: { Authorization: `Bearer ${userToken}` },
      };
      const uri = `/api/users/${username}/photos`;
      const res = await fetch(uri, requestOptions);
      if (res.ok) {
        const photos = (await res.json()) as UserPhotos;
        setPhotos(photos.list);
      }
    };
    void getUser();
  }, [username]);

  return (
    <div className="relative h-full w-full overflow-auto rounded-lg border-2 border-brown">
      {photoId > 0 && (
        <button className="absolute left-0 top-1/2 rounded-xl bg-green-5/50 hover:bg-green-5">
          <BiLeftArrowAlt size={20} onClick={() => setPhotoId(photoId - 1)} />
        </button>
      )}
      <figure className="relative -z-50 h-full overflow-hidden">
        <Image
          src={
            photos[photoId]
              ? `http://localhost/${photos[photoId].url}`
              : DefaultProfilePicture
          }
          fill={true}
          className="object-cover"
          sizes="300px"
          alt="photo"
        />
      </figure>
      {photoId + 1 < photos.length && (
        <button className="absolute right-0 top-1/2 rounded-xl bg-green-5/50 hover:bg-green-5">
          <BiRightArrowAlt size={20} onClick={() => setPhotoId(photoId + 1)} />
        </button>
      )}
    </div>
  );
};

export default UserPhoto;
