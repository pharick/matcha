'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

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
  revalidateTag('profile');
  return user;
}

export async function getUserProfile(username: string) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ['profile'] },
    }
  );
  if (res.status == 404 || res.status == 401) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const user = (await res.json()) as User;
  return user;
}

export async function visitUserProfile(username: string) {
  const token = cookies().get('token')?.value;
  await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/visit/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-cache',
    }
  );
}
