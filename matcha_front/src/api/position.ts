'use server';

import { cookies } from 'next/headers';

export async function updatePosition(pos: Position) {
  const token = cookies().get('token')?.value;
  if (!token) throw Error('No user token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/update_position/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(pos),
    }
  );
  if (!res.ok) throw Error('Something went wrong');
}
