'use client';

import { FC, FormEventHandler, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiX } from 'react-icons/bi';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from '@/imports/react-dnd';
import { HTML5Backend } from '@/imports/react-dnd';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { uploadPhoto } from '@/api/photoUpload';
import { movePhoto, removePhoto } from '@/api/photos';

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
        src={`${process.env.NEXT_PUBLIC_BASE_URL}${photo.url}`}
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
  photos: Photo[];
}

const PhotoUpload: FC<PhotoUploadProps> = ({ user, photos }) => {
  const router = useRouter();
  const [newPhoto, setNewPhoto] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!newPhoto) return;
    setIsUploading(true);
    await uploadPhoto(user.username, newPhoto);
    setNewPhoto(undefined);
    setIsUploading(false);
    router.refresh();
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
                  handleMove={(id, to) => movePhoto(user.username, id, to)}
                  handleRemove={() => removePhoto(user.username, photo.id)}
                />
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-center">No photos in your profile yet</p>
      )}
      <form className="mt-[20px] text-center" onSubmit={handleSubmit}>
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
          onChange={(e) => e.target.files && setNewPhoto(e.target.files[0])}
        />

        <Modal isOpen={!!newPhoto} onClose={() => setNewPhoto(undefined)}>
          <figure className="relative mb-2 h-[400px] w-full">
            <Image
              src={newPhoto ? URL.createObjectURL(newPhoto) : '#'}
              fill={true}
              alt="Photo to upload"
              className="object-contain"
            />
          </figure>
          <Button
            type="submit"
            className="mx-auto"
            loading={isUploading}
            disabled={isUploading}
          >
            Upload
          </Button>
        </Modal>
      </form>
    </DndProvider>
  );
};

export default PhotoUpload;
