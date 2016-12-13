import React, { Component } from 'react';
import { Map, Polyline, Polygon, Marker, TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import logo from './logo.svg';
import './App.css';
import './leaflet.css'
import foo from './counties.json'

class App extends Component {
  constructor () {
    super()
    this.state = {
      lat: 51.000,
      lng: -0.00,
      zoom: 4,
    }
  }

  render() {
    console.log(foo)
    return (
      <div className="App">
        <div className='BodyMap' style={{height: 1000}}>
          <Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
            <TileLayer
              attribution=''
              url={
                'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}'
              }
              ref='tile'
            />
            <GeoJSON data={foo}/>
          </Map>
        </div>
      </div>
    );
  }
}

export default App;
