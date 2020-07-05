import React from 'react';
import mapboxgl from 'mapbox-gl';
import lottie from 'lottie-web';
import animationData from './dice.json';

let animObj = null;
let map = null;

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 0,
      lat: 0,
      zoom: 13,
      data: []
    };

    this.findCity = this.findCity.bind(this);
  }

  componentDidMount() {
    animObj = lottie.loadAnimation({
      container: this.animBox,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    });

    map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    this.findCity();

    animObj.addEventListener("enterFrame", function (animation) {
      if (animation.currentTime > (animObj.totalFrames - 1)) {
        animObj.pause();
      }
    });

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  findCity() {
    fetch("http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off")
      .then(res => res.json())
      .then(
        (result) => {
          fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${Math.floor(Math.random() * result.metadata.totalCount)}&hateoasMode=off`)
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                  data: result.data[0]
                });
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
  }

  handlePlay() {
    animObj.play();
  }

  render() {
    return (
      <>
        <div id="button" ref={ref => this.animBox = ref} onClick={() =>{
          this.handlePlay();
          this.findCity();
        }} />
        <div>
          <div ref={el => this.mapContainer = el} className='mapContainer' />
        </div>
      </>
    );
  }
}

export default App;