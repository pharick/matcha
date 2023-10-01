'use server';

import { cookies } from 'next/headers';

export async function updatePosition(pos: Position, custom: boolean) {
  const token = cookies().get('token')?.value;
  await fetch(`${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/update_position/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      latitude: pos.latitude,
      longitude: pos.longitude,
      custom,
    }),
    cache: 'no-cache',
  });
}

export async function deleteCustomPosition() {
  const token = cookies().get('token')?.value;
  await fetch(
    `${process.env.NEXT_PUBLIC_BACK_BASE_URL}/api/delete_custom_position/`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-cache',
    }
  );
}
