import Head from 'next/head'
import { useState, useEffect } from 'react';
import ReactMapGL from 'react-map-gl';
import Lottie from 'react-lottie'
import * as dice from '../public/dice.json'

const diceOptions = {
  loop: true,
  autoplay: true,
  animationData: dice.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function Home() {
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 0,
    longitude: 0,
    zoom: 14,
  });
  const [info, setInfo] = useState({
    image: ''
  });
  const [animation, setAnimation] = useState({
    isPaused: false
  });

  useEffect(() => {
    findCity();
  }, []);

  function findCity() {
    fetch("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setTimeout(function () {
            fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=1&offset=${Math.floor(Math.random() * result.metadata.totalCount)}`, {
              "method": "GET",
              "headers": {
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
                "x-rapidapi-key": process.env.X_RAPIDAPI_KEY
              }
            })
              .then(res => res.json())
              .then(
                (result) => {
                  setInfo(x => ({ ...x, data: result }));
                  fetchCityData(`${result.data[0]?.city}, ${result.data[0]?.country}`);
                  setViewport(x => ({
                    ...x,
                    longitude: parseInt(result.data[0]?.longitude.toFixed(4)),
                    latitude: parseInt(result.data[0]?.latitude.toFixed(4)),
                    zoom: 14 
                  }));
                })
          }, 2000); // Because I'm on the free tier
        });
  };

  function fetchCityData(searchQuery) {
    fetch(`https://allow-any-origin.appspot.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchQuery}&inputtype=textquery&fields=photos&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`)
      .then(res => res.json())
      .then(
        (result) => {
          fetch(`https://allow-any-origin.appspot.com/https://maps.googleapis.com/maps/api/place/photo?maxheight=800&photoreference=${result?.candidates[0]?.photos[0]?.photo_reference}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`)
            .then(res => res.blob())
            .then(
              (image) => {
                setInfo(x => ({ ...x, image: URL.createObjectURL(image) }))
              });
        });
  }

  function handleClick() {
    setAnimation(x => ({ ...x, isPaused: false }));
    findCity();
  };

  return (
    <>
      <Head>
        <title>Map Tab</title>
        <link rel="icon" href="/favicon.ico" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.11.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <main>
        <div id="button" onClick={() => handleClick()}>
          <Lottie
            {...animation}
            options={diceOptions}
            isClickToPauseDisabled={true}
            eventListeners={
              [
                {
                  eventName: 'enterFrame',
                  callback: obj => {
                    if (obj.currentTime > (obj.totalTime - 1)) {
                      setAnimation(x => ({ ...x, isPaused: true }));
                    }
                  },
                },
              ]
            }
          />
        </div>
        <div className="sidebar">
          <img src={info.image} alt="city" />
          <h1>{info.data?.data[0]?.city}</h1>
          <p>{info.data?.data[0]?.country}</p>
          <p>{`${info.data?.data[0]?.latitude.toFixed(4)}, ${info.data?.data[0]?.longitude.toFixed(4)}`}</p>
        </div>
        <ReactMapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
          mapboxApiAccessToken={process.env.REACT_APP_ACCESS_TOKEN}
          onViewportChange={nextViewport => setViewport(nextViewport)}
        />
      </main>

      <style jsx>{`
        #button {
          cursor: pointer;
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
          width: 5em;
          height: 5em;
          margin-top: 5px;
          margin-right: 15px;
          z-index: 1 !important;
          font-weight: bold;
        }

        .sidebar {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-align: center;
          border-bottom: 1px solid #E8EAED;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border-radius: 8px;
          margin: 2em 0 2em 2em;
          display: inline-block;
          position: absolute;
          left: 0;
          z-index: 1 !important;
          background-color: white;
          width: 300px;
        }
        
        .sidebar img {
          border-radius: 8px 8px 0 0;
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}