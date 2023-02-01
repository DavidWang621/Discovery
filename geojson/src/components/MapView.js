import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView(props) {

    // countryStyle = {
    //     fillColor: "red",
    //     fillOpacity: 1,
    //     color: "black",
    //     weight: 2,
    // };

    console.log(props.file.features);
    return (
        <div>
            {/* {JSON.stringify(props.file)} */}
            <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]} >
                <GeoJSON
                    data={props.file.features}
                    // onEachFeature={this.onEachCountry}
                />
            </MapContainer>
        </div>
    )
}

export default MapView;