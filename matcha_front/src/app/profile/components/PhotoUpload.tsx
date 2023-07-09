import Button from '@/components/Button';
import Image from 'next/image';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Photo, User } from '@/app/interfaces';
import Modal from '@/components/Modal';

interface ProfileFormProps {
  user: User;
}

// const PhotoUpload: FC<ProfileFormProps> = ({ user }) => {
//   const [images, setImages] = useState<ImageListType>([]);
//   const [PhotoUpload, setPhotoUpload] = useState<boolean>(false);
//   const maxNumber = 5;

//   const onChange = (imageList: ImageListType) => {
//     // data for submit
//     setImages(imageList);
//     setPhotoUpload(true);
//   };

//   const fetchData = async (image: File) => {
//     const userToken = localStorage.getItem('token');
//     if (!userToken) return;
//     const formData = new FormData();
//     formData.append('photo', image);
//     const requestOptions = {
//       method: 'POST',
//       body: formData,
//       headers: {
//         Authorization: `Bearer ${userToken}`,
//       },
//     };
//     const uri = `/api/users/${user.username}/photos/`;
//     const res = await fetch(uri, requestOptions);
//     if (res.ok) {
//       const photo = (await res.json()) as Map<string, unknown>;
//       console.log(photo);
//     }
//   };

//   const handlePhotoUpload = () => {
//     const userToken = localStorage.getItem('token');
//     if (!userToken) return;
//     images.forEach((image) => {
//       if (image.file) void fetchData(image.file);
//     });
//   };

//   return (
//     <div className="w-2/5">
//       <ImageUploading
//         multiple
//         value={images}
//         onChange={onChange}
//         maxNumber={maxNumber}
//         dataURLKey="data_url"
//       >
//         {({
//           imageList,
//           onImageUpload,
//           onImageUpdate,
//           onImageRemove,
//           isDragging,
//           dragProps,
//         }) => (
//           <div className="h-full w-full">
//             {!PhotoUpload && (
//               <div className="flex h-full w-full items-center justify-center">
//                 <button
//                   className="rounded-[20px] bg-green-5 p-3 text-[28px] font-bold"
//                   onClick={onImageUpload}
//                   {...dragProps}
//                 >
//                   Upload Photo
//                 </button>
//               </div>
//             )}
//             <div className="flex flex-wrap justify-around">
//               {imageList.map((image, index) => (
//                 <div key={index} className="ml-[50px] mb-[50px]">
//                   <img
//                     src={image.data_url}
//                     className="rounded-lg"
//                     alt="user photo"
//                     width="200"
//                     height="200"
//                   />
//                   <div className="flex w-[200px] justify-between font-bold underline">
//                     <button onClick={() => onImageUpdate(index)}>Update</button>
//                     <button onClick={() => onImageRemove(index)}>Remove</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div>
//               {PhotoUpload && (
//                 <button className="m-auto block rounded-[20px] bg-green-5 p-3 text-[28px] font-bold" onClick={handlePhotoUpload}>Submit</button>
//               )}
//             </div>
//           </div>
//         )}
//       </ImageUploading>
//       {/* {PhotoUpload && <button onClick={handlePhotoUpload}>Submit</button>} */}
//     </div>
//   );
// };

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
        <label htmlFor="new-photo-input" className="border-2 rounded-[20px] p-[10px]">
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
    </section>
  );
};

export default PhotoUpload;
