import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, LayerGroup, FeatureGroup, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { GeomanControls } from 'react-leaflet-geoman-v2';
// import { topojson } from 'topojson';
import { topology } from 'topojson-server';
import { merge as mergeRegion } from 'topojson-client';
import * as turf from '@turf/turf'
import GeomanJsWrapper from './GeomanJsWrapper'
import { empty } from "leaflet/src/dom/DomUtil";
//import { useLeafletContext } from "@react-leaflet/core"; 
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import L from "leaflet";

function MapView(props) {
    const map = useMap()
    // var marker = L.marker([0, 0],{iconSize:[1,1]}).addTo(map);

    // map.on('mousemove', function(e) {
    //     // Update the marker position
    //     marker.setLatLng(e.latlng);

    //     // Show the coordinates in a popup above the marker
    //     var lat = e.latlng.lat.toFixed(4);
    //     var lng = e.latlng.lng.toFixed(4);
    //     marker.bindPopup("Lat: " + lat + "<br>Lng: " + lng).openPopup();
    // });
    
    const mapRef = props.mapRef
    const [isPopup, setPopup] = useState(false);
    const [update, setUpdate] = useState(1);

    const regionsSelectedRef = useRef([])
    let regionsClicked = [];
    const selectModeToggle = useRef(false)

    const currentRegion = useRef("");
    //const context = useLeafletContext();

    const nameChange = (event) => {
        let layer = event.target;

        let newName = prompt("Input new region name:", layer.feature.properties.name);
        if (!newName) {
            return;
        }
        props.changeName(layer.feature.properties.name, newName);
        layer.bindPopup(newName)
        layer.bindTooltip(layer.feature.properties.name,
            { permanent: true, direction: "center", className: "label" }
        ).openTooltip();
        //setUpdate(update+1);
        setUpdate(update => update + 1);
    }
    function arraysEqual(arr1, arr2) {
        // Check if the arrays have the same length
        if (arr1.length !== arr2.length) {
            return false;
        }

        // Loop through each element of the arrays and compare their values
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        // If all elements match, the arrays are equal
        return true;
    }
   

    const handleMarkerDragEnd = (e) => {
        
        
        console.log(e.target)
        const layer = e.target;
        const newlatlng=[];
        const indexPath = e.indexPath;
        
        const featureName = e.target.feature.properties.name;
        let index2 = -1;
        let index0 = indexPath[0]
        let index1 = indexPath[1]
        let latlng = [];

        let featureInd = -1
        let currentFeatures = props.file.features;
        if (indexPath.length == 3) {
            index2 = indexPath[2]


            for (let i = 0; i < currentFeatures.length; i++) {
                let name = currentFeatures[i].properties.name;
                if (name == featureName) {
                    featureInd = i;

                    latlng = currentFeatures[i].geometry.coordinates[index0][index1][index2]
                    newlatlng[0]=e.target._latlngs[index0][index1][index2].lng
                    newlatlng[1]=e.target._latlngs[index0][index1][index2].lat
                    console.log(newlatlng)
                    break;
                }
            }
        } else if (indexPath.length == 2) {

            for (let i = 0; i < currentFeatures.length; i++) {
                let name = currentFeatures[i].properties.name;
                if (name == featureName) {
                    featureInd = i;

                    latlng = currentFeatures[i].geometry.coordinates[index0][index1]
                    newlatlng[0]=e.target._latlngs[index0][index1].lng
                    newlatlng[1]=e.target._latlngs[index0][index1].lat
                    break;
                }
            }
        }


        // Loop through each feature in the GeoJSON file
        let ind0 = -1
        let ind1 = -1
        let ind2 = -1
        let featureInd2 = -1
        let feature2coord =[]
        const BreakError = {};
        try {
            currentFeatures.forEach(feature => {
                featureInd2++
                // Check if the feature is a polygon or a multipolygon

                if (feature.geometry.type === 'Polygon') {
                    // Loop through each coordinate in the polygon
                    ind0 = -1
                    ind1 = -1
                    ind2 = -1
                    feature.geometry.coordinates.forEach(coordinates => {
                        ind0++;
                        ind1 = -1;
                        coordinates.forEach(coordinate => {
                            ind1++;

                            // Check if the coordinate matches the given coordinate
                            if (arraysEqual(coordinate, latlng) && feature.properties.name !== featureName) {
                                console.log("Match found in feature: ", feature.properties.name);
                                throw BreakError;
                            }
                        });
                    });
                } else if (feature.geometry.type === 'MultiPolygon') {
                    // Loop through each polygon in the multipolygon
                    ind0 = -1
                    ind1 = -1
                    ind2 = -1
                    feature.geometry.coordinates.forEach(polygon => {
                        ind0++;
                        ind1 = -1;
                        ind2 = -1;
                        // Loop through each coordinate in the polygon

                        polygon.forEach(coordinates => {
                            ind1++;
                            ind2 = -1;

                            coordinates.forEach(coordinate => {
                                ind2++;

                                if (arraysEqual(coordinate, latlng) && feature.properties.name !== featureName) {
                                    console.log("Match found in feature: ", feature.properties.name);
                                    throw BreakError;

                                }
                            });
                        });
                    });
                }


            });
        } catch (err) {
            if (err !== BreakError) throw err;
        }
   
        if(ind2==-1){
            props.file.features[featureInd2].geometry.coordinates[ind0][ind1][0]=newlatlng[0]
            props.file.features[featureInd2].geometry.coordinates[ind0][ind1][1]=newlatlng[1]
        }else{
            props.file.features[featureInd2].geometry.coordinates[ind0][ind1][ind2][0]=newlatlng[0]
            props.file.features[featureInd2].geometry.coordinates[ind0][ind1][ind2][1]=newlatlng[1]
        }
        if(index2==-1){
            props.file.features[featureInd].geometry.coordinates[index0][index1][0]=newlatlng[0]
            props.file.features[featureInd].geometry.coordinates[index0][index1][1]=newlatlng[1]
        }else{
            props.file.features[featureInd].geometry.coordinates[index0][index1][index2][0]=newlatlng[0]
            props.file.features[featureInd].geometry.coordinates[index0][index1][index2][1]=newlatlng[1]
        }
        setUpdate(update => update + 1);
    };


    const handleLayerRemove = (e) => {
        const layer = e.layer;
        if (layer instanceof Marker) {
            // Do something with the removed marker
        }
    };

    const onEachCountry = (feature, layer) => {
        const countryName = "";
        if (update == 1) {
            if (feature.properties.NAME_3) {
                feature.properties.name = feature.properties.NAME_3;
            }
            else if (feature.properties.NAME_2) {
                feature.properties.name = feature.properties.NAME_2;
            }
            else if (feature.properties.NAME_1) {
                feature.properties.name = feature.properties.NAME_1;
            }
            else if (feature.properties.NAME_0) {
                feature.properties.name = feature.properties.NAME_0;
            }
        }



        layer.bindTooltip(layer.feature.properties.name,
            { permanent: true, direction: "center", className: "label" }
        ).openTooltip();

        let propString = ""
        let propObj = feature.properties;
        // for(const property in propObj){
        //     console.log(`${property}: ${propObj[property]}`);
        //     propString += `${property}: ${propObj[property]}` +"<br>"
        // }
        layer.bindPopup(propString, {});
        layer.options.fillOpacity = 0.4;


        layer.on('click', function (e) {
            console.log(e.target.getLatLngs());
            if (selectModeToggle.current) {

                let regions = regionsSelectedRef.current
                regionsClicked.push(e)


                // for(let i=0; i<regionsClicked.length; i++){
                //     if(e.target.feature.properties.name === regionsClicked[i].feature.properties.name){
                //         e.target.setStyle({
                //             // color: "blue",
                //             fillColor: "#3388ff",
                //             fillOpacity: 0.4,
                //         });
                //         regionsClicked.splice(i, 1);
                //         regions.splice(i, 1);
                //         return;
                //     }
                // }

                e.target.setStyle({
                    // color: "blue",
                    fillColor: "#284dd4",
                    fillOpacity: 0.7,
                });
                regions.push(e.target.feature);

                // if (regionsClicked.length > 2) {
                //     regionsClicked[0].setStyle({
                //         // color: "blue",
                //         fillColor: "#3388ff",
                //         fillOpacity: 0.4,
                //     });
                //
                //     regionsClicked.splice(0, 1);
                //     regions.splice(0,1);
                // }
            } else {
                if (currentRegion.current !== "") {
                    currentRegion.current.setStyle({
                        fillColor: "#3388ff",
                        fillOpacity: 0.4,
                    });
                }

                currentRegion.current = e.target;
                currentRegion.current.setStyle({
                    // color: "blue",
                    fillColor: "#284dd4",
                    fillOpacity: 0.7,
                });
            }


        });

        layer.on({
            dblclick: nameChange.bind(this)
        });
        layer.on('pm:vertexremoved', e => {
            console.log("vertexremoved")
        });
        layer.on('pm:vertexadded', e => {
            console.log("pm:vertexadded")
        });
        layer.on('pm:edit', e => {
            console.log("pm:edit")
            console.log(e.target)
        });
        layer.on('pm:markerdragstart', e => {
            console.log("pm:markerdragstart")


        });
        layer.on('pm:markerdragend', e => {
            console.log("pm:markerdragend")
            handleMarkerDragEnd(e);
        });
        layer.on('pm:markerclick', e => {
            console.log("pm:markerclick")
        });
        layer.on('pm:markerdragend', e => {
            //    console.log(e)
            //     //When done dragging an edit, it updates the geojson

        });
    }


    const handleMerge = (e) => {
        let regionsSelected = regionsSelectedRef.current

        if (regionsSelected.length < 2) {
            alert("please select 2 regions first");
            return;
        }
        let newName = prompt("enter new region name:");
        if (newName == null) {
            return;
        }

        let allRegionArray = props.file.features
        let emptyPoly = turf.multiPolygon([])

        for (let i = 0; i < regionsSelected.length; i++) {

            let region = regionsSelected[i]

            allRegionArray = allRegionArray.filter(x => x.properties.name !== region.properties.name) //remove all with same name regions
            let poly = region.geometry.coordinates

            poly = region.geometry.type === "Polygon" ?
                turf.polygon(poly)
                :
                turf.multiPolygon(poly)

            emptyPoly = turf.union(emptyPoly, poly);

        }

        emptyPoly.properties = regionsSelected[0].properties;
        emptyPoly.properties.name = newName;

        props.file.features = [...allRegionArray, emptyPoly] // add to the props.file.feature

        regionsSelectedRef.current = [] //empty everything
        //setUpdate(update+1) //absolutely crazy code but we need this to update the map
        setUpdate(update => update + 1);
    }

    let toggleSelectMode = () => {

        if (currentRegion.current !== "") {
            currentRegion.current.setStyle({
                fillColor: "#3388ff",
                fillOpacity: 0.4,
            });
        }
        selectModeToggle.current = !selectModeToggle.current
        if (selectModeToggle.current === false) {

            for (let i = 0; i < regionsClicked.length; i++) {
                regionsClicked[i].target.setStyle({
                    fillColor: "#3388ff",
                    fillOpacity: 0.4,
                });
            }
            regionsClicked = []
        }
    };

    return (
        <div>
            {props.file.features ?
                <div>
                    <button
                        onClick={handleMerge
                        }>
                        merge your last 2 clicked regions
                    </button>

                    <GeomanJsWrapper
                        merge={handleMerge}
                        toggleSelectMode={toggleSelectMode}
                    />

                    <FeatureGroup>

                        <GeoJSON
                            key={update}
                            data={props.file.features}
                            onEachFeature={onEachCountry}
                        />

                    </FeatureGroup>





                </div>
                :
                <></>
            }
        </div>
    )
}

export default MapView;