'use server';

import { cookies } from 'next/headers';

export async function getAllNotifications() {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw Error('Something went wrong');
  return (await res.json()) as MNotification[];
}

export async function viewNotification(id: number) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${id}/view/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-cache',
    }
  );
  if (!res.ok) throw Error('Something went wrong');
}
