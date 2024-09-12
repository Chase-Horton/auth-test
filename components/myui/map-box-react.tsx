import * as React from 'react';
import Map, {Source, Layer} from 'react-map-gl';
import {CircleLayerSpecification} from 'react-map-gl';
import type {FeatureCollection} from 'geojson';

const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}}
  ]
};

const layerStyle: CircleLayerSpecification = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf'
  }
};
import "mapbox-gl/dist/mapbox-gl.css"; 
export default function MapBoxReact() {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: "100%", height: "100%"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
    </Map>
  );
}