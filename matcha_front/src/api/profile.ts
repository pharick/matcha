'use server';

import { cookies } from 'next/headers';

export async function updateProfile(username: string, reqData: ProfileData) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/`,
    {
      method: 'PATCH',
      body: JSON.stringify(reqData),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );
  if (!res.ok) throw Error('Something went wrong');
  const user = (await res.json()) as User;
  return user;
}

export async function getUserPhotos(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/`
  );
  if (!res.ok) throw Error('Something went wrong');
  const photos = (await res.json()) as { list: Photo[] };
  return photos.list;
}

export async function uploadPhoto(username: string, data: FormData) {
  console.log(data.get('photo')?.valueOf());
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
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
  console.log(res);
  if (!res.ok) throw Error('Something went wrong');
  const newPhoto = (await res.json()) as Photo;
  return newPhoto;
}
