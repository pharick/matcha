import Button from '@/components/Button';
import Image from 'next/image';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Photo, User } from '@/app/interfaces';
import Modal from '@/components/Modal';
import { useDrag, useDrop } from 'react-dnd';

interface PhotoUploadItemProps {
  photo: Photo;
  handleMove: (from: number, to: number) => void;
}

const PhotoUploadItem: FC<PhotoUploadItemProps> = ({ photo, handleMove }) => {
  const ref = useRef<HTMLElement | null>(null);

  const [, drop] = useDrop<Photo>({
    accept: 'profileImage',
    // hover: (item, monitor) => {
    //   if (!ref.current) {
    //     return;
    //   }

    //   const dragIndex = item.index;
    //   const hoverIndex = photo.index;
    //   if (dragIndex == hoverIndex) {
    //     return;
    //   }
    // },
    drop: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = photo.index;
      if (dragIndex == hoverIndex) {
        return;
      }
      handleMove(dragIndex - 1, hoverIndex - 1);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'profileImage',
    item: () => {
      return { id: photo.id, index: photo.index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  drag(drop(ref));

  return (
    <figure ref={ref} className="relative m-1 h-[250px] w-[200px]">
      <Image
        src={`http://localhost${photo.url}`}
        fill={true}
        alt={`Photo ${photo.id}`}
        className="object-cover"
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

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await fetch(`/api/users/${user.username}/photos/`);
      if (response.ok) {
        const photos = (await response.json()) as { list: Photo[] };
        setPhotos(photos.list);
      }
    };
    void fetchPhotos();
  }, [user]);

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
    console.log(res);
    if (res.ok) {
      const photo = (await res.json()) as Photo;
      setPhotos((photos) => [...photos, photo]);
      setNewPhoto(undefined);
    }
  };

  const handleMove = (from: number, to: number) => {
    if (from < to) {
      setPhotos((photos) => [
        ...photos.slice(0, from),
        ...photos.slice(from + 1, to),
        photos[from],
        ...photos.slice(to, -1),
      ]);
    }
  };

  return (
    <>
      <ul className="flex flex-wrap justify-center">
        {photos
          .sort((a, b) => a.index - b.index)
          .map((photo) => (
            <li key={photo.id}>
              <PhotoUploadItem photo={photo} handleMove={handleMove} />
            </li>
          ))}
      </ul>
      <form className="mt-[20px] text-center">
        <label
          htmlFor="new-photo-input"
          className="rounded-[20px] border-2 border-brown bg-gradient-radial  from-green-2/50 to-green-1/30 p-[10px] font-bold"
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

      {newPhoto && (
        <Modal handleClose={() => setNewPhoto(undefined)}>
          <figure className="relative h-[250px] w-[200px]">
            <Image
              src={URL.createObjectURL(newPhoto)}
              fill={true}
              alt="Photo to upload"
              className="object-cover"
            />
          </figure>
          <Button onClick={() => void handleNewPhotoUpload()}>Upload</Button>
        </Modal>
      )}
    </>
  );
};

export default PhotoUpload;
