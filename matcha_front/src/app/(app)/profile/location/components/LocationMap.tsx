'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle.js';
import 'ol/ol.css';

import { deleteCustomPosition, updatePosition } from '@/api/position';

interface LocationMapProps {
  user: CurrentUser;
}

const mapStyle = new Style({
  image: new CircleStyle({
    radius: 10,
    fill: new Fill({ color: '#F39BB3' }),
    stroke: new Stroke({ color: '#403539', width: 3 }),
  }),
});

const LocationMap: FC<LocationMapProps> = ({ user }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  const initCoords =
    user.custom_position.latitude != 0 && user.custom_position.longitude != 0
      ? [user.custom_position.longitude, user.custom_position.latitude]
      : [user.last_position.longitude, user.last_position.latitude];

  const [coords, setCoords] = useState<Coordinate>(initCoords);
  const [featuresLayer, setFeaturesLayer] =
    useState<VectorLayer<VectorSource>>();

  const handleMapClick = (event: MapBrowserEvent<UIEvent>) => {
    if (!mapRef.current) return;
    const coords = mapRef.current.getCoordinateFromPixel(event.pixel);
    const longLatCoords = transform(coords, 'EPSG:3857', 'EPSG:4326');
    setCoords(longLatCoords);
  };

  useEffect(() => {
    featuresLayer?.setSource(
      new VectorSource({
        features: [
          new Feature({
            geometry: new Point(fromLonLat(coords)),
          }),
        ],
      })
    );
  }, [coords, featuresLayer]);

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    const featuresLayer = new VectorLayer({
      source: new VectorSource(),
    });
    setFeaturesLayer(featuresLayer);

    mapRef.current = new Map({
      layers: [new TileLayer({ source: new OSM() }), featuresLayer],
      view: new View({
        center: fromLonLat(coords),
        zoom: 10,
      }),
      target: mapElement.current,
    });

    mapRef.current.on('click', handleMapClick);

    featuresLayer.setStyle(mapStyle);
  }, [mapElement, mapRef, user]);

  const handleSavePosition = async () => {
    await updatePosition({ longitude: coords[0], latitude: coords[1] }, true);
    mapRef.current?.setView(
      new View({
        center: fromLonLat(coords),
        zoom: 10,
      })
    );
  };

  const handleDeletePosition = async () => {
    await deleteCustomPosition();
    setCoords([user.last_position.longitude, user.last_position.latitude]);
    mapRef.current?.setView(
      new View({
        center: fromLonLat([
          user.last_position.longitude,
          user.last_position.latitude,
        ]),
        zoom: 10,
      })
    );
  };

  return (
    <>
      <div ref={mapElement} className="mb-3 h-[600px] w-full" />

      <div className="flex w-full justify-center gap-2">
        <button
          onClick={() => void handleSavePosition()}
          className="flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Save custom position
        </button>

        <button
          onClick={() => void handleDeletePosition()}
          className="flex items-center rounded-lg border-2 border-brown px-3 py-2 text-lg shadow-md hover:bg-green-5/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Delete custom position
        </button>
      </div>
    </>
  );
};

export default LocationMap;
