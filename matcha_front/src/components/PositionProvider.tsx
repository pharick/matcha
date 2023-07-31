'use client';

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface PositionProviderProps {
  children?: ReactNode;
}

interface PositionContextInterface {
  position: Position;
}

export const PositionContext = createContext<PositionContextInterface>({
  position: { longitude: 0, latitude: 0 },
});

const PositionProvider: FC<PositionProviderProps> = ({ children }) => {
  const [position, setPosition] = useState<Position>({
    latitude: 0,
    longitude: 0,
  });

  const savePosition = async (pos: Position) => {
    setPosition(pos);
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/update_position', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(pos),
    });
  };

  const getPosition = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await savePosition({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      async () => {
        const res = await fetch(
          `https://geolocation-db.com/json/${process.env.NEXT_PUBLIC_GEOLOCATIONDB_KEY}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as Position;
        await savePosition({
          longitude: data.longitude,
          latitude: data.latitude,
        });
      }
    );
  };

  const value = useMemo(
    () => ({
      position,
    }),
    [position]
  );

  return (
    <PositionContext.Provider value={value}>
      {children}
    </PositionContext.Provider>
  );
};

export default PositionProvider;
