import React, {useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { GeomanControls } from 'react-leaflet-geoman-v2'

function MapView(props) {
    const [isPopup, setPopup] = useState(false);

    if(props.file.features){
        console.log(props.file.features)
    }

    const nameChange = (event) => {
        let layer = event.target;
        console.log(layer.feature.properties.name);

        let newCountry = prompt("Input new region name:", layer.feature.properties.name);
        props.changeName(layer.feature.properties.name, newCountry);
        layer.bindPopup(newCountry)
        layer.bindTooltip(layer.feature.properties.name,
            {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
    };

    const onEachCountry = (feature, layer) => {
        const countryName = feature.properties.name;
        layer.bindTooltip(layer.feature.properties.name,
            {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
        layer.bindPopup(countryName);
        layer.options.fillOpacity = 0.4;

        layer.on({
            dblclick: nameChange.bind(this)
        });
    };

    const handleChange = (e) =>{
        console.log(e)
    }

    return (
        <div>
            {props.file.features ?
                <div>


                    <MapContainer
                        style={{ height: "80vh" }} zoom={2} center={[20, 100]}
                        editable={true}
                    >
                        <FeatureGroup>
                            <GeoJSON
                                data={props.file.features}
                                onEachFeature={onEachCountry}
                            />
                            <GeomanControls
                                options={{
                                    position: 'topleft',
                                    drawMarker: false,
                                    drawText: false,
                                    drawPolyline: false,
                                    drawRectangle: false,
                                    drawPolygon: false,
                                    drawCircle: false,
                                    drawCircleMarker:false
                                }}
                                globalOptions={{
                                    continueDrawing: true,
                                    editable: false,
                                    limitMarkersToCount: 100,
                                    removeVertexOn: "contextmenu" //right click on verticies to remove
                                }}
                                onCreate={handleChange}
                                onChange={(e) => console.log('onChange', e)}
                            />

                        </FeatureGroup>

                        <TileLayer url="xxx" />

                        <LayerGroup>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <TileLayer url="http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" />
                        </LayerGroup>

                        {/* <GeoJSON
                                    data={props.file.features}
                                    onEachFeature={onEachCountry}
                                /> */}

                    </MapContainer>


                    {/*<ReactLeafletEditable*/}
                    {/*    ref={editRef}*/}
                    {/*    map={map}*/}
                    {/*>*/}
                    {/*    <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]}*/}
                    {/*                  editable={true}>*/}
                    {/*        <GeoJSON*/}
                    {/*            data={props.file.features}*/}
                    {/*            onEachFeature={onEachCountry}*/}
                    {/*        />*/}
                    {/*    </MapContainer>*/}
                    {/*</ReactLeafletEditable>*/}



                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapView;