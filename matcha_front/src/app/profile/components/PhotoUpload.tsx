import Button from '@/components/Button';
import Image from 'next/image';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Photo, User } from '@/app/interfaces';
import Modal from '@/components/Modal';

interface ProfileFormProps {
  user: User;
}

const PhotoUpload: FC<ProfileFormProps> = ({ user }) => {
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
    if (res.ok) {
      const photo = (await res.json()) as Photo;
      setPhotos((photos) => [...photos, photo]);
      setNewPhoto(undefined);
    }
  };

  return (
    <section>
      <ul className="flex flex-wrap">
        {photos.map((photo) => (
          <li key={photo.id}>
            <figure className="relative m-1 h-[250px] w-[200px]">
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
      <form>
        <label htmlFor="new-photo-input">Upload photo</label>
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
    </section>
  );
};

export default PhotoUpload;
