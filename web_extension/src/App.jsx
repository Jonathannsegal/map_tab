import React from 'react';

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

  mapContainer = React.createRef();

  componentDidMount() {
    this.initializeMap();
  }

  componentWillUnmount() {
    if (this.state.map) {
      this.state.map.remove();
    }
  }

  initializeMap = () => {
    if (!window.google?.maps?.places) {
      this.setState({ data: { city: 'Google Maps key required' } });
      return;
    }
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
    this.randomizeLocation();
  }

  render() {
    return (
      <>
        <button id="button" type="button" onClick={this.handlePlay} aria-label="Show another city">🎲</button>
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
