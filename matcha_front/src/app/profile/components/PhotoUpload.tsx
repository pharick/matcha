import Button from '@/components/Button';
import Image from 'next/image';
import { FC, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { User } from '@/app/interfaces';

interface ProfileFormProps {
  user: User;
}

const PhotoUpload: FC<ProfileFormProps> = ({ user }) => {
  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 5;

  const onChange = (imageList: ImageListType) => {
    // data for submit
    setImages(imageList);
  };

  const fetchData = async (image: File) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    const formData = new FormData();
    formData.append('value', image);
    const requestOptions = {
      method: 'POST',
      body: formData,
      //   headers: { Authorization: `Bearer ${userToken}`, Content-Type: 'multipart/form-data' },
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    const uri = `/api/users/${user.username}/photos/`;
    console.log(uri);
    const res = await fetch(uri, requestOptions);
    if (res.ok) console.log(res);
  };

  const handlePhotoUpload = () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;
    images.forEach((image) => {
      if (image.file) void fetchData(image.file);
    });
  };

  return (
    <div className="flex w-2/5 items-center justify-center">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div>
            <button
              className="rounded-[20px] bg-green-5 p-3 text-[28px] font-bold"
              onClick={onImageUpload}
              {...dragProps}
            >
              Upload Photo
            </button>
            {imageList.map((image, index) => (
              <div key={index} className="">
                <img src={image.data_url} alt="" width="200" />
                <div className="">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      <button onClick={handlePhotoUpload}>Submit</button>
    </div>
  );
};

export default PhotoUpload;
