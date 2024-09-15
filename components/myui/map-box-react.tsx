"use client"
import "mapbox-gl/dist/mapbox-gl.css"
import ReactMapGl, { Marker } from "react-map-gl"
import {useMemo, useState} from "react"
import { MarkerData } from "@/lib/schemas/CDE";
// import { FeatureCollection } from "geojson";
// import { CircleLayerSpecification } from "mapbox-gl";



// const layerStyle: CircleLayerSpecification = {
//   id: 'point',
//   type: 'circle',
//   paint: {
//     'circle-radius': 10,
//     'circle-color': '#007cbf'
//   },
//   source: 'my-data'
// };
interface ReactMapBoxMapProps{
    markerData: MarkerData[];
}
export default function ReactMapBoxMap(props:ReactMapBoxMapProps){
    const markers = useMemo(() => {
        return props.markerData.map((marker: MarkerData, index) => {
            return (
                <Marker 
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    key={index}
                >
                    <div className="bg-blue-600 w-[15px] h-[15px]" style={{borderRadius:"50%", cursor:"pointer"}}></div>
                </Marker>
            )
        })
    }, [props.markerData])
    // const geojson = useMemo(() => {
    //     return {
    //         type: 'FeatureCollection',
    //         features: props.markerData.map((marker: MarkerData) => {
    //             return {
    //                 type: 'Feature',
    //                 geometry: {
    //                     type: 'Point',
    //                     coordinates: [marker.longitude, marker.latitude]
    //                 },
    //                 properties: {
    //                     description: marker.description
    //                 }
    //             }
    //         })
    //     }
    // }, [props.markerData])
    const [viewport, setViewport] = useState({
        latitude: 37.6869,
        longitude: -97.3300,
        zoom: 8
    });
    return (
        <div className="w-full h-full rounded-lg">
            <ReactMapGl
                {...viewport}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/videoscope/cl3ddmsj5007p14rqsxk5nduc"
                style={{ borderRadius: "0.9rem"}}
                onMove={evt => setViewport(evt.viewState)}
            >
            {/*<Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
            </Source>*/}
            {markers}
            </ReactMapGl>
        </div>
    )
}