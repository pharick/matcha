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
    <div className="-mt-[200px] flex w-screen items-center justify-center">
      <button className="rounded-xl bg-green-5/50 hover:bg-green-5">
        <BiLeftArrowAlt size={50} onClick={() => setPhotoId(photoId - 1)} />
      </button>

      {photoId == 0 && (
        <div className="flex items-center">
          <figure className="relative z-50 h-[300px] w-[300px]">
            <Image
              src={`http://localhost/${photos[photoId]?.url}`}
              fill={true}
              className="rounded-md object-cover"
              sizes="250px"
              alt="photo"
            />
          </figure>
          <figure className="relative z-10 h-[200px] w-[200px] -translate-x-[100px]">
            <Image
              src={`http://localhost/${photos[photoId + 1]?.url}`}
              fill={true}
              className="rounded-md object-cover"
              sizes="250px"
              alt="photo"
            />
          </figure>
        </div>
      )}

      {photoId > 0 && (
        <div className="flex items-center">
          <figure className="relative z-10 h-[200px] w-[200px] translate-x-[50px]">
            <Image
              src={`http://localhost/${photos[photoId - 1]?.url}`}
              fill={true}
              className="rounded-md object-cover"
              sizes="250px"
              alt="photo"
            />
          </figure>
          <figure className="relative z-50 h-[300px] w-[300px]">
            <Image
              src={`http://localhost/${photos[photoId]?.url}`}
              fill={true}
              className="rounded-md object-cover"
              sizes="250px"
              alt="photo"
            />
          </figure>
        </div>
      )}

      <button className="rounded-xl bg-green-5/50 hover:bg-green-5">
        <BiRightArrowAlt size={50} onClick={() => setPhotoId(photoId + 1)} />
      </button>
    </div>
  );
};

export default UserPhoto;
