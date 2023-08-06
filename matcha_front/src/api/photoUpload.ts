import { findCookie } from '@/helpers';
import { revalidateTag } from 'next/cache';

export async function uploadPhoto(username: string, photo: File) {
  const token = findCookie('token');
  const data = new FormData();
  data.append('photo', photo);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONT_BASE_URL}/api/users/${username}/photos/`,
    {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );
  if (!res.ok) throw Error('Something went wrong');
  const newPhoto = (await res.json()) as Photo;
  revalidateTag('photos');
  return newPhoto;
}
