import Head from 'next/head'
import { useMemo, useState } from 'react'

const cities = [
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'New York City', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5072, longitude: -0.1276 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241 },
]

function mapUrl(city) {
  const delta = 0.08
  const bbox = [city.longitude - delta, city.latitude - delta, city.longitude + delta, city.latitude + delta]
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join('%2C')}&layer=mapnik&marker=${city.latitude}%2C${city.longitude}`
}

export default function Home() {
  const [cityIndex, setCityIndex] = useState(0)
  const city = cities[cityIndex]
  const src = useMemo(() => mapUrl(city), [city])

  function randomize() {
    setCityIndex(current => {
      if (cities.length < 2) return current
      let next = current
      while (next === current) next = Math.floor(Math.random() * cities.length)
      return next
    })
  }

  return (
    <>
      <Head>
        <title>Map Tab</title>
        <meta name="description" content="Discover a new city whenever you roll the map." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <iframe title={`Map of ${city.name}`} src={src} />
        <button type="button" onClick={randomize} aria-label="Show another city">🎲</button>
        <section>
          <h1>{city.name}</h1>
          <p>{city.country}</p>
          <p>{city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}</p>
        </section>
        <footer>
          <a href="https://github.com/Jonathannsegal/map_tab">View source on GitHub</a>
        </footer>
      </main>
      <style jsx>{`
        main { min-height: 100vh; position: relative; overflow: hidden; font-family: system-ui, sans-serif; }
        iframe { border: 0; height: 100vh; width: 100%; }
        button { position: absolute; right: 20px; top: 20px; z-index: 2; width: 64px; height: 64px; border: 0; border-radius: 50%; font-size: 34px; cursor: pointer; box-shadow: 0 3px 12px rgba(0,0,0,.3); background: white; }
        section, footer { position: absolute; z-index: 2; background: white; border-radius: 10px; box-shadow: 0 3px 12px rgba(0,0,0,.25); padding: 18px 22px; }
        section { left: 24px; top: 24px; min-width: 250px; }
        section h1 { margin: 0 0 10px; }
        section p { margin: 5px 0; }
        footer { bottom: 24px; right: 24px; }
        footer a { color: #075985; }
      `}</style>
      <style jsx global>{`html, body { margin: 0; } * { box-sizing: border-box; }`}</style>
    </>
  )
}
