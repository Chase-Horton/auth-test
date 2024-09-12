"use client"
import React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; 
// import the mapbox-gl styles so that the map is displayed correctly

function MapboxMap() {
    // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [hoverInfo, setHoverInfo] = React.useState(null);

    // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
    const mapContainerRef = React.useRef(null);

  React.useEffect(() => {
    const node = mapContainerRef.current;
        // if the window object is not found, that means
        // the component is rendered on the server
        // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

        // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/videoscope/cl3ddmsj5007p14rqsxk5nduc",
      center: [ -97.3300, 37.6869 ],
      zoom: 9,
    });
    mapboxMap.on('load', () => {
      mapboxMap.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-97.3300, 37.6869]
              },
              properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
              }
            }
          ]
        }
      });

      mapboxMap.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 5,
          'circle-color': '#007cbf'
        }
      });
    });
    mapboxMap.on('mouseenter', 'points-layer', (e) => {
      console.log(e);
    });
    mapboxMap.on('mouseleave', 'points-layer', () => {
      setHoverInfo(null);
    });
        // save the map object to React.useState
    setMap(mapboxMap);

        return () => {
      mapboxMap.remove();
    };
  }, []);

    return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} className="rounded-lg" />;
}

export default MapboxMap