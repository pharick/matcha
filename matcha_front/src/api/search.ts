'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function search({
  ageFrom,
  ageTo,
  minFame,
  maxDistance,
  tags,
}: SearchParams) {
  const token = cookies().get('token')?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/search/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        age_from: ageFrom,
        age_to: ageTo,
        min_fame: minFame,
        max_distance: maxDistance,
        tags,
      }),
      next: { tags: ['profile'] },
    }
  );
  if (res.status == 403) redirect('/profile');
  if (!res.ok) throw Error('Something went wrong');
  const data = (await res.json()) as { list: User[] };
  return data.list;
}
