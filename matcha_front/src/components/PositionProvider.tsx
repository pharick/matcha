'use client';

import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Position } from '@/interfaces';

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
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      });
    });
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
