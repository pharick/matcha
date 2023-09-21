'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAllChatMessages(username: string) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/chat/${username}/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status == 403) redirect('/profile');
  if (!res.ok) throw Error('Something went wrong');
  const data = (await res.json()) as { list: ChatMessage[] };
  return data.list;
}

export async function getAllChats() {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/chat/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status == 403) redirect('/profile');
  if (!res.ok) throw Error('Something went wrong');
  const data = (await res.json()) as { list: User[] };
  return data.list;
}
