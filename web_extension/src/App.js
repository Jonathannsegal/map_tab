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
      zoom: 14,
      data: [],
      image: ''
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
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
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
              this.fetchCityData(`${result.data[0]?.city}, ${result.data[0]?.country}`);
              map.jumpTo({
                center: [
                  result.data[0].longitude.toFixed(4),
                  result.data[0].latitude.toFixed(4)
                ],
                zoom: 14
              });
            })
      });
  }


  fetchCityData(searchQuery) {
    fetch(`http://allow-any-origin.appspot.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchQuery}&inputtype=textquery&fields=photos&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`)
    .then(res => res.json())
    .then(
      (result) => {
        fetch(`http://allow-any-origin.appspot.com/https://maps.googleapis.com/maps/api/place/photo?maxheight=800&photoreference=${result?.candidates[0]?.photos[0]?.photo_reference}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`)
        .then(res => res.blob())
        .then(
          (image) => {
            this.setState({
              image: URL.createObjectURL(image)
            });
          });
      });
  }

  handlePlay() {
    animObj.play();
  }

  render() {
    return (
      <>
        <div id="button" ref={ref => this.animBox = ref} onClick={() => {
          this.handlePlay();
          this.findCity();
        }} />
        <div className="sidebar">
          <img src={this.state.image} alt="city" />
          <h1>{this.state.data?.city}</h1>
          <p>{this.state.data?.country}</p>
          <p>{`${this.state.lat}, ${this.state.lng}`}</p>
        </div>
        <div className="bottombar">
          <p>Star on <a href="https://github.com/Jonathannsegal/map_tab">Github</a></p>
        </div>
        <div>
          <div ref={el => this.mapContainer = el} className='mapContainer' />
        </div>
      </>
    );
  }
}

export default App;