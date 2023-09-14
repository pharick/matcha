'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAllLikes(offset: number, limit: number) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/likes/?${new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    }).toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status == 403) redirect('/profile');
  if (!res.ok) throw Error('Something went wrong');
  return (await res.json()) as { list: User[]; total: number };
}

export async function getAllLikesMe(offset: number, limit: number) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACK_BASE_URL
    }/api/likes/me/?${new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    }).toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status == 403) redirect('/profile');
  if (!res.ok) throw Error('Something went wrong');
  return (await res.json()) as { list: User[]; total: number };
}
