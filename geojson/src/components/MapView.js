import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView(props) {
    const nameChange = (country) => {
        console.log(country);
    };

    const onEachCountry = (country, layer) => {
        const countryName = country.properties.name;
        // layer.bindTooltip(country.properties.name,
        // {permanent: true, direction:"center",className: "label"}
        // ).openTooltip();
        layer.bindPopup(countryName);
        layer.options.fillOpacity = 0.4;

        layer.on({
            click: nameChange
        });
    };

    return (
        <div>
            {props.file.features ?
            <div>
            <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]} >
                <GeoJSON 
                    data={props.file.features} onEachFeature={onEachCountry}
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