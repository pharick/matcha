'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function getUserPhotos(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/`,
    { next: { tags: ['photos'] } }
  );
  if (!res.ok) throw Error('Something went wrong');
  const photos = (await res.json()) as { list: Photo[] };
  return photos.list;
}

export async function removePhoto(username: string, id: number) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/${id}/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw Error('Something went wrong');
  revalidateTag('photos');
}

export async function movePhoto(username: string, id: number, to: number) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/${id}/`;
  await fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify({ index: to }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  revalidateTag('photos');
}