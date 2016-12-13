import React, { Component } from 'react';
import { Map, Polyline, Polygon, Marker, TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import logo from './logo.svg';
import './App.css';
import './leaflet.css'
import foo from './counties.json'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import {initalizeMapbox} from './mapbox.js'
import _ from 'lodash'

class Toolbar extends Component {
  render(){
    if (!this.props.name){ return (false) }
    return(
      <div className='Toolbar'>
        <h2> {this.props.name}</h2>
        <h3> fips: {this.props.fips}</h3>
        <h3> median income: {this.props.medianIncome}</h3>
        <h3> population: {this.props.population}</h3>
      </div>
    )
  }
}

class App extends Component {
  constructor () {
    super()
    this.state = {
      lat: 51.000,
      lng: -0.00,
      county: {},
      zoom: 4,
    }
  }

  onHover(feature){
    const county = feature && feature.properties
    if (county){
      if (_.get(this.state, 'county.FIPS') !== county.FIPS){
        this.setState({county})
      }
    }
  }

  componentDidMount(){
    initalizeMapbox(this.onHover.bind(this))
  }

  render() {
    const {county} = this.state
    return (
      <div className="App">
        <div className='BodyMap' id={'map'} style={{height: 1000}}>
          <div className='map-overlay' id='map-overlay'/>
          <Toolbar
            name={county.COUNTY}
            fips={county.FIPS}
            medianIncome={county['median-income']}
            population={county.population}
          />
        </div>
      </div>
    );
  }
}

export default App;
