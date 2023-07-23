'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';

import { Photo, UserPhotos } from '@/interfaces';
import QuickInfo from './QuickInfo';

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
    <div className="flex items-start justify-center py-4">
      <div className="flex h-3/5 items-center">
        {photoId > 0 ? (
          <button className="rounded-xl bg-green-5/50 hover:bg-green-5">
            <BiLeftArrowAlt size={40} onClick={() => setPhotoId(photoId - 1)} />
          </button>
        ) : (
          <div className="w-[40px]"></div>
        )}
      </div>
      <div className="h-[700px] w-2/5  overflow-auto border-2 rounded-lg border-brown">
        <figure className="relative -z-50  h-4/5 overflow-hidden">
          <Image
            src={`http://localhost/${photos[photoId]?.url}`}
            fill={true}
            className="object-cover"
            sizes="250px"
            alt="photo"
          />
        </figure>
        <div className="relative  bg-green-2/50 overflow-hidden">
          <QuickInfo username={username} />
        </div>
      </div>
      <div className="flex h-3/5 items-center">
        {photoId + 1 != Object.keys(photos).length ? (
          <button className="rounded-xl bg-green-5/50 hover:bg-green-5">
            <BiRightArrowAlt
              size={40}
              onClick={() => setPhotoId(photoId + 1)}
            />
          </button>
        ) : (
          <div className="w-[40px]"></div>
        )}
      </div>
    </div>
  );
};

export default UserPhoto;
