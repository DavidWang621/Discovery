import React, { useState } from 'react';
import MapView from './components/MapView';

function App() {
  const [fileExist, setFileExist] = useState(false);
  const [GeoJson, setGeoJson] = useState({});

  const handleSelectFile = (e) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = e => {
      setGeoJson(JSON.parse(e.target.result));
    }
    setFileExist(true);
  }

  return (
    <div className="App">
      <div>Imput geo.json File</div>
      <input type="file" accept="geo.json" onChange={handleSelectFile}/>
      {fileExist ? <MapView file={GeoJson}/> : <></>}
    </div>
  );
}

export default App;
