import { findCookie } from '@/helpers';

export async function uploadPhoto(username: string, photo: File) {
  const token = findCookie('token');
  if (!token) throw Error('No user token');
  const data = new FormData();
  data.append('photo', photo);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/`,
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
  return newPhoto;
}
