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
    const properties =[];
    let count = 0;
    let shpfile = null;
    let dbffile = null;


    const readShapefile = (e) => {
        console.log(properties);
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
                        //result.value.properties.name = names[count];
                        result.value.properties = properties[count];
                        
                        count++;
                        // console.log(result.value);
                        empty.features.push(result.value)
                        
                    }
                    if(!result.done){
                        e.read().then(next)
                    }
                    else{
                        setGeoJson(empty)
                        setFileExist(true);
                        console.log(empty);
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
                    console.log(result)
                    if(result.value)
                    {
                       /* if(result.value.NAME_3)
                            names[count]=result.value.NAME_3;
                        else if(result.value.NAME_2)
                            names[count]=result.value.NAME_2;
                        else if(result.value.NAME_1)
                            names[count]=result.value.NAME_1;
                        else if(result.value.NAME_0)
                            names[count]=result.value.NAME_0;
                        count++;*/
                        properties[count] = result.value;
                        count++;
                    }
                    if(!result.done){
                        e.read().then(next)
                    }
                    else{
                        console.log("done with name")
                        console.log(names);
                    }
                })
        })
    }

    const handleSubmit = (e) => {
        {
            if (shpfile != null && dbffile != null){
                const reader = new FileReader();
                setGeoJson({});
                reader.readAsArrayBuffer(shpfile);
                reader.onload = async e => {
                await readShapefile(reader.result)
                }
                console.log("shp file read");
            }
        }
    }



    const handleSelectFile = (e) => {
        {
            shpfile = e.target.files[0];
      
            console.log("shp file read");
        }
    }
    const handleSelectFile2 = (e) => {
        {
            dbffile = e.target.files[0];
            //this is for shapefile
            const reader = new FileReader();

            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onload = async e => {
                await readShapefile2(reader.result)
            }
            console.log("dbf file read");
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
            {/* <button onClick={upload}>
                Display North America geojson
            </button> */}

            <div>Shapefile: 
                <input type="file" accept="geo.json" onChange={handleSelectFile}/>
            </div>
            <div>Dbf: 
                <input type="file" accept="geo.json" onChange={handleSelectFile2}/>

            </div>
            <div></div>
            <div> <input type="submit" value="submit" onClick={handleSubmit} /></div>


            {fileExist ? <MapView file={GeoJson} changeName={changeRegionName}/> : <></>}

        </div>
    );
}

export default App;
