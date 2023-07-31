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

export async function getUserInfo(username: string) {
  const token = cookies().get('token')?.value;
  if (!token) return undefined;
  const requestOptions = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/`;
  const res = await fetch(uri, requestOptions);
  if (!res.ok) throw Error('Something went wrong');
  const user = (await res.json()) as User;
  return user;
}