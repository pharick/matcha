'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAllNotifications(offset: number, limit: number) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACK_BASE_URL
    }/api/notifications/?${new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    }).toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status == 403) redirect('/profile');
  if (!res.ok) throw Error('Something went wrong');
  return (await res.json()) as { list: MNotification[]; total: number };
}

export async function getUnreadNotifications() {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/notifications/unread/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status == 403) return [];
  if (!res.ok) throw Error('Something went wrong');
  return (await res.json()) as MNotification[];
}

export async function viewNotification(id: number) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/notifications/${id}/view/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-cache',
    }
  );
  if (!res.ok) throw Error('Something went wrong');
}
