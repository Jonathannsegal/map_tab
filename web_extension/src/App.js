import React from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 0,
      lat: 0,
      zoom: 12.5
    };
  }

  componentDidMount() {

    fetch("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_API_KEY
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      return fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${Math.floor(Math.random() * data.metadata.totalCount)}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key": process.env.REACT_APP_API_KEY
        }
      });
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      map.jumpTo({
        center: [
          data[0]?.longitude.toFixed(4) ?? 0,
          data[0]?.latitude.toFixed(4) ?? 0
        ]
      });
    });

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    return (
      <div>
        <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
    )
  }
}

export default App;