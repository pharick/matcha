'use server';

import { cookies } from 'next/headers';

export async function viewNotification(id: number) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${id}/view/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw Error('Something went wrong');
}
