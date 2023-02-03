import React, { useState } from 'react';
import MapView from './components/MapView';
import * as shapefile from "shapefile";

function App() {

  const [fileExist, setFileExist] = useState(false);
  const [GeoJson, setGeoJson] = useState({});
  const [state, setState] = useState(false);

  const [data, setData] = React.useState([]);




  const readShapefile = (e) => {
    //can only upload shp file but not zip file for now
    let res = [];
    shapefile
        .open(
            e,
            //"https://cdn.rawgit.com/mbostock/shapefile/master/test/points.shp",
            null
        ).then(function (e){
      e.read().then(
          function next(result){
            if(result.value)
              res.push(result.value)
            if(!result.done){
              e.read().then(next)
            }
          })
    })
    console.log("finish shpfile")
    console.log(res)
    return res
  }



  const handleSelectFile = (e) => {
    {

      //this is for geojson
      // const reader = new FileReader();
      // setGeoJson({});
      // reader.readAsText(e.target.files[0]);
      // reader.onload = e => {
      //   setGeoJson(JSON.parse(e.target.result));
      // }
      // setFileExist(true);
      // console.log(JSON.stringify(GeoJson))


      //this is for shapefile
      const reader = new FileReader();
      setGeoJson({});
      reader.readAsArrayBuffer(e.target.files[0])
      reader.onload = async e => {
        await readShapefile(reader.result)
      }
      setFileExist(true);
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

  return (
      <div className="App">
        <div>Imput geo.json File</div>
        <input type="file" accept="geo.json" onChange={handleSelectFile}/>
        {fileExist ? <MapView file={GeoJson} changeName={changeRegionName}/> : <></>}
      </div>
  );
}

export default App;
