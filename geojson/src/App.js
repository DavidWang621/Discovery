import React, { useState } from 'react';
import MapView from './components/MapView';

function App() {
  const [fileExist, setFileExist] = useState(false);
  const [GeoJson, setGeoJson] = useState({});
  const [state, setState] = useState(false);

  const handleSelectFile = (e) => {
    const reader = new FileReader();
    setGeoJson({});
    reader.readAsText(e.target.files[0]);
    reader.onload = e => {
      setGeoJson(JSON.parse(e.target.result));
    }
    setFileExist(true);
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
      <div>Input geo.json File</div>
      <input type="file" accept="geo.json" onChange={handleSelectFile}/>
      {fileExist ? <MapView file={GeoJson} changeName={changeRegionName}/> : <></>}
    </div>
  );
}

export default App;
