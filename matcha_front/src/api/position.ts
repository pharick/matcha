'use server';

import { cookies } from 'next/headers';

export async function updatePosition(pos: Position) {
  const token = cookies().get('token')?.value;
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update_position/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(pos),
    cache: 'no-cache',
  });
}
