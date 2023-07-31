'use client';

import { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import { Map, View } from 'ol';

import OSM from 'ol/source/OSM';
import { useGeographic } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { Text, Fill, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

import Header from '@/components/Header';
import { PositionContext } from '@/components/PositionProvider';

useGeographic();

const mapStyle = new Style({
  image: new CircleStyle({
    radius: 5,
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

const IndexPage: NextPage = () => {
  const positionContext = useContext(PositionContext);

  const map = new Map({
    target: 'map',
  });

  useEffect(() => {
    const posGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              positionContext.position.longitude,
              positionContext.position.latitude,
            ],
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
          mapStyle.getText().setText(feature.get('name'));
          return mapStyle;
        },
      }),
    ]);

    map?.setView(
      new View({
        center: [
          positionContext.position.longitude,
          positionContext.position.latitude,
        ],
        zoom: 16,
      })
    );
  }, [positionContext.position]);

  return (
    <>
      {/* <Heade user={} /> */}
      <div id="map" className="h-[600px] w-[800px]"></div>
    </>
  );
};

export default IndexPage;
