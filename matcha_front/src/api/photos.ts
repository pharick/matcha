'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function getUserPhotos(username: string) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ['photos'] },
    }
  );
  if (res.status == 404 || res.status == 401) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const photos = (await res.json()) as { list: Photo[] };
  return photos.list;
}

export async function removePhoto(username: string, id: number) {
  const token = cookies().get('token')?.value;
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
  const uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/photos/${id}/`;
  await fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify({ index: to }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });
  revalidateTag('photos');
}
