import React from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: 0,
      lng: 0,
      lat: 0,
      zoom: 12.5
    };
  }

  componentDidMount() {
    fetch("http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off")
      .then(res => res.json())
      .then(
        (result) => {
          fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${Math.floor(Math.random() * result.metadata.totalCount)}&hateoasMode=off`)
            .then(res => res.json())
            .then(
              (result) => {
                map.jumpTo({
                  center: [
                    result.data[0].longitude.toFixed(4),
                    result.data[0].latitude.toFixed(4)
                  ]
                });
              },
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
              }
            )
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )

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