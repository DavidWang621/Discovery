import React, {useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { GeomanControls } from 'react-leaflet-geoman-v2';
// import { topojson } from 'topojson';
import { topology } from 'topojson-server';
import { merge as mergeRegion } from 'topojson-client';
import * as turf from '@turf/turf'
// import {GeomanJsWrapper} from './GeomanJsWrapper'

function MapView(props) {
    const [isPopup, setPopup] = useState(false);
    const [update,setUpdate] = useState(1);
    let regions = []


    // if(props.file.features){
    //     console.log(props.file.features)
    // }

    const nameChange = (event) => {
        let layer = event.target;
        console.log(layer.feature.properties.name);

        let newName = prompt("Input new region name:", layer.feature.properties.name);
        if(!newName){
            return;
        }
        props.changeName(layer.feature.properties.name, newName);
        layer.bindPopup(newName)
        layer.bindTooltip(layer.feature.properties.name,
            {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
    }

    const onEachCountry = (feature, layer) => {
        const countryName = feature.properties.name;
        layer.bindTooltip(layer.feature.properties.name,
            {permanent: true, direction:"center",className: "label"}
        ).openTooltip();
        layer.bindPopup(countryName);
        layer.options.fillOpacity = 0.4;



        layer.on('click', function (e) {
            regions.push(e.target.feature)
            console.log("select this country");
            console.log(regions)
            // props.file.features.pop()
        });

        layer.on({
            dblclick: nameChange.bind(this)
        });
    }

    const handleMerge =(e) => {
        if(regions.length<2){
            alert("please select 2 regions first");
            regions = [];
            return;
        }
        let region2 = regions[regions.length-1]
        let region1 = regions[regions.length-2]
        let region1Name = region1.properties.name
        let region2Name = region2.properties.name
        regions = [];

        let newName = prompt("enter new region name:", region1Name);
        if(newName == null){
            return;
        }
        console.log("regions to merge", region1, region2);

        let allRegionArray = props.file.features
        console.log("all regions before", allRegionArray)

        //this part is to remove the 2 existing region
        for(let i=0;i<allRegionArray.length;i++){
            if(allRegionArray[i].properties.name === region1Name){
                allRegionArray.splice(i,1)
                i--;
            }
            if(allRegionArray[i].properties.name === region2Name){
                allRegionArray.splice(i,1)
                i--;
            }
        }
        console.log("allregion", allRegionArray);
        //this will be our new combined region (we'll just add it to region1 ig
        let poly1 = region1;
        let poly2 = region2;
        if(region1.geometry.type === "Polygon"){
            console.log("region1 is polygon");
            poly1 = turf.polygon(region1.geometry.coordinates)
        }
        else{
            console.log("region1 is multipolygon");
            poly1 = turf.multiPolygon(region1.geometry.coordinates)
        }
        if(region2.geometry.type === "Polygon"){
            console.log("region2 is polygon");
            poly2 = turf.polygon(region2.geometry.coordinates)
        }
        else{
            console.log("region2 is multipolygon");
            poly2 = turf.multiPolygon(region2.geometry.coordinates)
        }
        let union = turf.union(poly1, poly2);
        // console.log(union);
        union.properties = region1.properties;
        union.properties.name = newName;
        console.log(union);
        allRegionArray.push(union);
        setUpdate(update+1) //absolutely crazy code but we need this to update the map
    }

    const handleCreate = (e) =>{
        console.log(e)
    }

    return (
        <div>
            {props.file.features ?
                <div>
                    <button
                    onClick={handleMerge
                    }>
                    merge your last 2 clicked regions
                    </button>
                    <MapContainer
                        style={{ height: "80vh" }} zoom={2} center={[20, 100]}
                        editable={true}
                    >
                        <FeatureGroup>
                            <GeoJSON
                                key={update}
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
                                    limitMarkersToCount: 50,
                                    removeVertexOn: "contextmenu", //right click on verticies to remove
                                    hideMiddleMarkers: true,
                                }}
                                onCreate={handleCreate}
                                onChange={(e) => console.log('onChange', e)}
                            />

                        </FeatureGroup>

                        <TileLayer url="xxx" />

                        <LayerGroup>
                            <TileLayer
                                attribution='&amp;copy <update href="http://osm.org/copyright">OpenStreetMap</update> contributors'
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