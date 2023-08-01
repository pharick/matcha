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

export async function getUserProfile(username: string) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (res.status == 404) return undefined;
  if (!res.ok) throw Error('Something went wrong');
  const user = (await res.json()) as User;
  return user;
}

export async function visitUserProfile(username: string) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/visit/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw Error('Something went wrong');
}
