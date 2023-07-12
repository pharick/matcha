import Button from '@/components/Button';
import Image from 'next/image';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Photo, User } from '@/app/interfaces';
import Modal from '@/components/Modal';
import { useDrag, useDrop } from 'react-dnd';

interface PhotoUploadItemProps {
  photo: Photo;
}

const PhotoUploadItem: FC<PhotoUploadItemProps> = ({ photo }) => {
  const ref = useRef<HTMLElement | null>(null);

  const [, drop] = useDrop<Photo>({
    accept: 'profileImage',
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = photo.index;

      if (dragIndex == hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      //moveImage(dragIndex, hoverIndex);
      console.log(dragIndex, hoverIndex);

      item.index = hoverIndex;
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

  return (
    <>
      <ul className="flex flex-wrap justify-center">
        {photos.map((photo) => (
          <li key={photo.id}>
            <figure className="relative m-1 h-[250px] w-[200px] rounded-lg border-2 border-brown">
              <Image
                src={`http://localhost${photo.url}`}
                fill={true}
                alt={`${user.username}-${photo.id}`}
                className="object-cover"
              />
            </figure>
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
