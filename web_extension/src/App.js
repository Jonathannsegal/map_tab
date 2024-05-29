import React from 'react';
import mapboxgl from 'mapbox-gl';
import lottie from 'lottie-web';
import animationData from './dice.json';

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

export default class App extends React.Component {
  state = {
    lng: 0,
    lat: 0,
    zoom: 14,
    data: {},
    image: '',
    cities: ["Sydney", "New York City", "Los Angeles", "London"],
    map: null,
    service: null
  };

  animBox = React.createRef();
  mapContainer = React.createRef();
  animObj = null;

  componentDidMount() {
    this.initializeLottieAnimation();
    this.initializeMap();
  }

  componentWillUnmount() {
    if (this.animObj) {
      this.animObj.destroy();
    }
    if (this.state.map) {
      this.state.map.remove();
    }
  }

  initializeLottieAnimation = () => {
    this.animObj = lottie.loadAnimation({
      container: this.animBox.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData
    });
  }

  initializeMap = () => {
    const map = new google.maps.Map(this.mapContainer.current, {
      center: { lat: -33.867, lng: 151.195 },
      zoom: 15
    });

    this.setState({ map }, this.randomizeLocation);
  }

  randomizeLocation = () => {
    const { cities, map } = this.state;
    const selectedCity = cities[Math.floor(Math.random() * cities.length)];
    const request = {
      query: selectedCity,
      fields: ['name', 'geometry', 'photos']
    };

    const service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        map.setCenter(results[0].geometry.location);
        this.setState({
          lng: results[0].geometry.location.lng(),
          lat: results[0].geometry.location.lat(),
          data: { city: results[0].name },
          image: results[0].photos ? results[0].photos[0].getUrl() : ''
        });
      }
    });
  }

  handlePlay = () => {
    this.animObj.goToAndPlay(0);
    this.randomizeLocation();
  }

  render() {
    return (
      <>
        <div id="button" ref={this.animBox} onClick={this.handlePlay} />
        <div className="sidebar">
          <img src={this.state.image} alt="city" />
          <h1>{this.state.data.city}</h1>
          <p>{`${this.state.lat}, ${this.state.lng}`}</p>
        </div>
        <div className="bottombar">
          <p>Star on <a href="https://github.com/Jonathannsegal/map_tab">Github</a></p>
        </div>
        <div>
          <div ref={this.mapContainer} className="mapContainer" />
        </div>
      </>
    );
  }
}
