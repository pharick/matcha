'use client';

import { updatePosition } from '@/api/position';
import { FC } from 'react';

async function getPositionByIP() {
  const res = await fetch(
    `https://geolocation-db.com/json/${process.env.NEXT_PUBLIC_GEOLOCATIONDB_KEY}`
  );
  if (!res.ok) throw Error('Something went wrong');
  const pos = (await res.json()) as Position;
  return pos;
}

const PositionUpdater: FC = () => {
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

  return <></>;
};

export default PositionUpdater;
