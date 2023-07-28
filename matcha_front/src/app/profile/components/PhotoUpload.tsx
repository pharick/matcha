'use client';

import Button from '@/components/Button';
import Image from 'next/image';
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Photo, User } from '../../../types';
import Modal from '@/components/Modal';
import { useDrag, useDrop } from 'react-dnd';
import { BiX } from 'react-icons/bi';
import { DndProvider } from '@/imports/react-dnd';
import { HTML5Backend } from '@/imports/react-dnd';

interface PhotoUploadItemProps {
  photo: Photo;
  handleMove: (id: number, to: number) => Promise<void>;
  handleRemove: (id: number) => Promise<void>;
}

const PhotoUploadItem: FC<PhotoUploadItemProps> = ({
  photo,
  handleMove,
  handleRemove,
}) => {
  const ref = useRef<HTMLElement | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'profileImage',
    drop: async (item: Photo) => {
      if (item.index < photo.index) {
        await handleMove(item.id, photo.index + 1);
      } else if (item.index > photo.index) {
        await handleMove(item.id, photo.index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'profileImage',
    item: () => {
      return { id: photo.id, index: photo.index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <figure
      ref={ref}
      className={`group relative m-1 h-[224px] w-[224px] rounded-md border-2 border-brown bg-brown ${
        isOver ? 'translate-y-1 opacity-50' : ''
      } ${isDragging ? 'invisible' : ''}`}
    >
      <button
        onClick={() => void handleRemove(photo.id)}
        className="color-white absolute left-full top-0 z-50 -ml-3.5 -mt-1.5 hidden rounded-full bg-brown transition hover:rotate-90 group-hover:block"
      >
        <BiX color="white" size={24} />
      </button>
      <Image
        src={`http://localhost${photo.url}`}
        fill={true}
        alt={`Photo ${photo.id}`}
        className="rounded-md object-cover"
        sizes="250px"
      />
    </figure>
  );
};

interface PhotoUploadProps {
  user: User;
}

const PhotoUpload: FC<PhotoUploadProps> = ({ user }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhoto, setNewPhoto] = useState<File>();

  const fetchPhotos = useCallback(async () => {
    const response = await fetch(`/api/users/${user.username}/photos/`);
    if (response.ok) {
      const photos = (await response.json()) as { list: Photo[] };
      setPhotos(photos.list);
    }
  }, [user]);

  useEffect(() => {
    void fetchPhotos();
  }, [fetchPhotos]);

  const handleNewPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewPhoto(e.target.files[0]);
    e.target.files = null;
  };

  const handleNewPhotoUpload = async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken || !newPhoto) return;
    const formData = new FormData();
    formData.append('photo', newPhoto);
    const requestOptions = {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const uri = `/api/users/${user.username}/photos/`;
    const res = await fetch(uri, requestOptions);
    if (res.ok) {
      const photo = (await res.json()) as Photo;
      setPhotos((photos) => [...photos, photo]);
      setNewPhoto(undefined);
    }
  };

  const handleMove = async (id: number, to: number) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const requestOptions = {
      method: 'PATCH',
      body: JSON.stringify({ index: to }),
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const uri = `/api/users/${user.username}/photos/${id}`;
    await fetch(uri, requestOptions);
    await fetchPhotos();
  };

  const handleRemove = async (id: number) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const uri = `/api/users/${user.username}/photos/${id}`;
    await fetch(uri, requestOptions);
    setPhotos((photos) => [...photos.filter((photo) => photo.id != id)]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {photos.length > 0 ? (
        <ul className="flex flex-wrap justify-center">
          {photos
            .sort((a, b) => a.index - b.index)
            .map((photo) => (
              <li key={photo.id}>
                <PhotoUploadItem
                  photo={photo}
                  handleMove={handleMove}
                  handleRemove={handleRemove}
                />
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-center">No photos in your profile yet</p>
      )}
      <form className="mt-[20px] text-center">
        <label
          htmlFor="new-photo-input"
          className="mx-auto block w-fit cursor-pointer rounded-[20px] border-2 border-brown bg-gradient-radial from-green-2/50 to-green-1/30 px-[20px] py-[5px] text-[24px] font-bold shadow-md hover:bg-gradient-radial hover:from-green-5/70 hover:to-brown/70 active:translate-x-px active:translate-y-px active:shadow-none"
        >
          Upload photo
        </label>
        <input
          id="new-photo-input"
          className="hidden"
          type="file"
          multiple={false}
          accept="image/jpeg,image/png"
          onChange={handleNewPhotoChange}
        />
      </form>

      <Modal isOpen={!!newPhoto} handleClose={() => setNewPhoto(undefined)}>
        <figure className="relative mb-2 h-[400px] w-full">
          <Image
            src={newPhoto ? URL.createObjectURL(newPhoto) : '#'}
            fill={true}
            alt="Photo to upload"
            className="object-contain"
          />
        </figure>
        <Button onClick={() => void handleNewPhotoUpload()} className="mx-auto">
          Upload
        </Button>
      </Modal>
    </DndProvider>
  );
};

export default PhotoUpload;
