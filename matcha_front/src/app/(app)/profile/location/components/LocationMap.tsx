'use client';

import { FC, useEffect } from 'react';
import { Map, View } from 'ol';

import OSM from 'ol/source/OSM';
import { useGeographic } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { Text, Fill, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

interface LocationMapProps {
  user: User;
}

const mapStyle = new Style({
  image: new CircleStyle({
    radius: 8,
    fill: new Fill({ color: '#403539' }),
  }),
  text: new Text({
    font: 'bold 12px sans-serif',
    fill: new Fill({
      color: '#403539',
    }),
    offsetY: 15,
  }),
});

const LocationMap: FC<LocationMapProps> = ({ user }) => {
  useGeographic();

  useEffect(() => {
    const map = new Map({
      target: 'map',
    });

    const posGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [user.longitude, user.latitude],
          },
          properties: {
            name: 'Your position',
          },
        },
      ],
    };

    map?.setLayers([
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(posGeoJson),
        }),
        style: function (feature) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          mapStyle.getText().setText(feature.get('name'));
          return mapStyle;
        },
      }),
    ]);

    map?.setView(
      new View({
        center: [user.longitude, user.latitude],
        zoom: 16,
      })
    );
  }, [user]);

  return <div id="map" className="h-[600px] w-[800px]"></div>;
};

export default LocationMap;
