'use client';

import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { GeolocationDBResponse, Position } from '@/interfaces';

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

  const getPosition = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      async (error) => {
        console.log(error);
        if (!process.env.NEXT_PUBLIC_GEOLOCATIONDB_KEY) return;
        const res = await fetch(
          `https://geolocation-db.com/json/${process.env.NEXT_PUBLIC_GEOLOCATIONDB_KEY}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as GeolocationDBResponse;
        setPosition({ longitude: data.longitude, latitude: data.latitude });
      }
    );
  };

  useEffect(() => {
    void getPosition();
  }, []);

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
