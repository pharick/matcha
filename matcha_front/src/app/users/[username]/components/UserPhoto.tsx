'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';

import { Photo, UserPhotos } from '@/interfaces';

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
        console.log(photos);
        setPhotos(photos.list);
      }
    };
    void getUser();
  }, [username]);

  return (
    <div className="h-full w-full overflow-auto border-2 rounded-lg border-brown relative">
      {photoId > 0 && (
        <button className="rounded-xl bg-green-5/50 hover:bg-green-5 absolute left-0 top-1/2">
          <BiLeftArrowAlt size={20} onClick={() => setPhotoId(photoId - 1)} />
        </button>
      )}
      <figure className="relative -z-50 h-full overflow-hidden">
        <Image
          src={`http://localhost/${photos[photoId]?.url}`}
          fill={true}
          className="object-cover"
          sizes="300px"
          alt="photo"
        />
      </figure>
      {photoId + 1 != Object.keys(photos).length && (
        <button className="rounded-xl bg-green-5/50 hover:bg-green-5 absolute right-0 top-1/2">
          <BiRightArrowAlt
            size={20}
            onClick={() => setPhotoId(photoId + 1)}
          />
        </button>
      )}
    </div>
  );
};

export default UserPhoto;
