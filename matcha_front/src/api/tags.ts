'use server';

import { cookies } from 'next/headers';

export async function findTags(value: string) {
  const token = cookies().get('token')?.value;
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/tags/find/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ value }),
    }
  );
  if (!resp.ok) return [];
  const data = (await resp.json()) as { list: string[] };
  return data.list;
}
