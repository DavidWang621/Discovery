import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView(props) {
    const nameChange = (event) => {
        let layer = event.target;
        console.log(layer.feature.properties.name);
    };

    const onEachCountry = (feature, layer) => {
        const countryName = feature.properties.name;
        layer.bindTooltip(feature.properties.name,
        {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
        // layer.bindPopup(countryName);
        layer.options.fillOpacity = 0.4;

        layer.on({
            click: nameChange.bind(this)
        });
    };

    return (
        <div>
            {props.file.features ?
            <div>
            <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]} >
                <GeoJSON 
                    data={props.file.features} 
                    onEachFeature={onEachCountry}
                />
            </MapContainer>
            </div>
            : 
            <></>
            }
        </div>
    )
}

export default MapView;