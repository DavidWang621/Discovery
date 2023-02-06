import React, {useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { GeomanControls } from 'react-leaflet-geoman-v2';
// import { topojson } from 'topojson';
import { topology } from 'topojson-server';
import { merge as mergeRegion } from 'topojson-client';
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
    };

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
    };
    const handleMerge =(e) => {
        let region1 = regions[regions.length-1]
        let region2 = regions[regions.length-2]

        let region1Name = region1.properties.name
        let region2Name = region2.properties.name

        let allRegionArray = props.file.features
        console.log("handle merge")
        console.log(allRegionArray)

        //this part is to remove the 2 existing region
        for(let i=0;i<allRegionArray.length;i++){
            if(allRegionArray[i].properties.name === region1Name)
                allRegionArray.splice(i,1)
            if(allRegionArray[i].properties.name === region2Name)
                allRegionArray.splice(i,1)
        }

        //this will be our new combined region (we'll just add it to region1 ig
        let combinedRegion = region1
        combinedRegion.properties.name = region1.properties.name + region2.properties.name

        // let combinedCoords= combinedRegion.geometry.coordinates
        // let region2Coord= region2.geometry.coordinates

        // ===========================================================================

        // let topoAll = topology(props.file.features);
        // console.log("topo of whole", props.file, topoAll);
        // let topoRegion1 = topology(region1);
        // let topoRegion2 = topology(region2);
        console.log("trying to merge", region1, region2);
        // console.log("topoversion", topoRegion1, topoRegion2);
        // let arc1 = {type: topoRegion1.objects.geometry.type, arcs: topoRegion1.arcs}
        // let arc2 = {type: topoRegion2.objects.geometry.type, arcs: topoRegion2.arcs}
        // console.log("arcs", arc1, arc2);
        // let mergedRegion = mergeRegion(topoAll, [arc1, arc2]);
        // console.log("topomerge", mergedRegion);
        // console.log(topoRegion1);

        // ===========================================================================

        // console.log("whole", allRegionArray);
        // let arr1 = [];
        // for(let arr of region1.geometry.coordinates){
        //     // console.log(arr)
        //     arr1 = arr1.concat(arr[0]);
        // }
        // let arr2 = [];
        // for(let arr of region2.geometry.coordinates){
        //     // console.log(arr)
        //     arr2 = arr2.concat(arr[0]);
        // }

        // let coord1String = arr1.map(JSON.stringify);
        // let coord2String = arr2.map(JSON.stringify);
        // // console.log(coord1String);
        // let coordSetString = new Set(coord1String.concat(coord2String));
        // let coordSet = Array.from(coordSetString, JSON.parse);
        // console.log([coordSet]);

        // combinedRegion.geometry.coordinates = [coordSet];
        // combinedRegion.geometry.type = "Polygon";

        // ===========================================================================

        // console.log(region2)
        // console.log(region2Coord)
        // console.log(region2Coord[0])
        //TODO:
        //do the polygon magics here
        //merge by click on 2 country, and then click the merge button
        //if you run this without adding anything it will just delete the first region
        //and then create a new region with combined name
        // for(let polygons of region2Coord){
        //     console.log("this is 1 polygon")
        //     console.log(polygons)
        //     //do something like combinedCoords.push(polygons) the idea is there but it just didnt work
        //     console.log("this is all of the 2d vec of that polygon")
        //     // for(let coords of polygons){
        //     //     console.log(coords)
        //     // }
        // }

        //add the new combined region
        allRegionArray.push(combinedRegion)
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
                                    removeVertexOn: "contextmenu" //right click on verticies to remove
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