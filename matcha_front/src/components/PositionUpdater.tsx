'use client';

import { FC, useEffect } from 'react';

import { updatePosition } from '@/api/position';

async function getPositionByIP() {
  const res = await fetch(
    `https://geolocation-db.com/json/${process.env.NEXT_PUBLIC_GEOLOCATIONDB_KEY}`
  );
  if (!res.ok) throw Error('Something went wrong');
  const pos = (await res.json()) as Position;
  return pos;
}

const PositionUpdater: FC = () => {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updatePosition({
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        });
      },
      async () => {
        const pos = await getPositionByIP();
        await updatePosition(pos);
      }
    );
  }, []);

  return <></>;
};

export default PositionUpdater;
