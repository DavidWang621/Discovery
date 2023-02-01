import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView(props) {
    const [isPopup, setPopup] = useState(false);

    const nameChange = (event) => {
        let layer = event.target;
        console.log(layer.feature.properties.name);

        let newCountry = prompt("Input new region name:", layer.feature.properties.name);
        props.changeName(layer.feature.properties.name, newCountry);
        layer.feature.properties.name = newCountry;
    };

    const onEachCountry = (feature, layer) => {
        const countryName = feature.properties.name;
        layer.bindTooltip(layer.feature.properties.name,
        {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
        // layer.bindPopup(countryName);
        layer.options.fillOpacity = 0.4;

        layer.on({
            dblclick: nameChange.bind(this)
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