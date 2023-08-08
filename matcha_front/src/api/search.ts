'use server';

import { cookies } from 'next/headers';

export async function search() {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/search/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ['profile'] },
    }
  );
  if (!res.ok) throw Error('Something went wrong');
  const data = (await res.json()) as { list: User[] };
  return data.list;
}
