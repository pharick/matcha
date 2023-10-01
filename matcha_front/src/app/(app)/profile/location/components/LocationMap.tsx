'use client';

import { FC, useEffect, useRef } from 'react';
import { Map, View } from 'ol';

import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';

import 'ol/ol.css';

interface LocationMapProps {
  user: CurrentUser;
}

// eslint-disable-next-line react-hooks/rules-of-hooks

// const mapStyle = new Style({
//   image: new CircleStyle({
//     radius: 8,
//     fill: new Fill({ color: '#403539' }),
//   }),
//   text: new Text({
//     font: 'bold 12px sans-serif',
//     fill: new Fill({
//       color: '#403539',
//     }),
//     offsetY: 15,
//   }),
// });

const LocationMap: FC<LocationMapProps> = ({ user }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;
    console.log(user.last_position.latitude, user.last_position.longitude);
    mapRef.current = new Map({
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([
          user.last_position.latitude,
          user.last_position.longitude,
        ]),
        zoom: 16,
      }),
      target: mapElement.current,
    });
  }, [mapElement, mapRef, user]);

  return <div ref={mapElement} className="h-[600px] w-full" />;
};

export default LocationMap;
