import React, { useState } from 'react';
import MapView from './components/MapView';
import * as shapefile from "shapefile";
import na from './na.json'

function App() {

    const [fileExist, setFileExist] = useState(false);
    const [GeoJson, setGeoJson] = useState({});
    const [state, setState] = useState(false);

    const [data, setData] = React.useState([]);

    const names = [];
    let count = 0;


    const readShapefile = (e) => {
        count = 0;
        //can only upload shp file but not zip file for now
        let res = [];
        let empty = {}
        empty.type = "FeatureCollection"
        empty.features = res
        shapefile
            .open(
                e,
                //"https://cdn.rawgit.com/mbostock/shapefile/master/test/points.shp",
                null
            ).then(function (e){
            e.read().then(
                function next(result){
                    if(result.value)
                    {
                        console.log("in progress")

                        result.value.properties.name = names[count];
                        count++;
                        console.log(result.value);
                        empty.features.push(result.value)
                    }
                    if(!result.done){
                        e.read().then(next)
                    }
                    else{
                        console.log("done")
                        console.log(JSON.stringify(empty))
                        console.log(names);
                        setGeoJson(empty)
                        setFileExist(true);
                    }
                })
        })
    }

    const readShapefile2 = (e) => {
        count = 0;
        //can only upload shp file but not zip file for now

        shapefile
            .openDbf(
                e,
                //"https://cdn.rawgit.com/mbostock/shapefile/master/test/points.shp",
                null
            ).then(function (e){
            e.read().then(
                function next(result){
                    if(result.value)
                    {
                        names[count]=result.value.NAME_1;
                        count++;
                    }
                    if(!result.done){
                        e.read().then(next)
                    }
                    else{

                        console.log(names);

                    }
                })
        })
    }



    const handleSelectFile = (e) => {
        {
            //this is for shapefile
            const reader = new FileReader();
            setGeoJson({});
            reader.readAsArrayBuffer(e.target.files[0])
            reader.onload = async e => {
                await readShapefile(reader.result)
            }
            console.log("shp file read")
        }
    }
    const handleSelectFile2 = (e) => {
        {

            //this is for shapefile
            const reader = new FileReader();

            reader.readAsArrayBuffer(e.target.files[0])
            reader.onload = async e => {
                await readShapefile2(reader.result)
            }
            console.log("shp file read")
        }
    }

    const changeRegionName = (oldName, newName) =>{
        console.log("newold", oldName, newName);
        let temp = GeoJson;
        temp.features.forEach((i) => {
            if (i.properties.name === oldName) {
                i.properties.name = newName;
                setGeoJson(temp);
            }
        })
        console.log("features", GeoJson.features);
        setState(!state);
    }

    const upload = () => {
        console.log("upload the stuff")
        console.log(na)
        setGeoJson(na);
        setFileExist(true);
    }

    return (
        <div className="App">
            <button onClick={upload}>
                Display North America geojson
            </button>


            <div>
                upload geojson
                <input type="file" accept="geo.json" onChange={handleSelectFile} />

            </div>
            <div>upload shape second
                <input type="file" accept="geo.json" onChange={handleSelectFile}/>
            </div>
            <div>upload dbf first
                <input type="file" accept="geo.json" onChange={handleSelectFile2}/>

            </div>


            {fileExist ? <MapView file={GeoJson} changeName={changeRegionName}/> : <></>}

        </div>
    );
}

export default App;
