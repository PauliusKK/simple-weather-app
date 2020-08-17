import React, { useState, useReducer, useLayoutEffect, useRef } from 'react';
import { find } from 'lodash';
import WeatherWidget from '@eggtronic/react-weather-widget';
import Cities from './city.list.json';
import './App.scss';

function App() {
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState(undefined);
  const [coords, setCoords] = useState(undefined);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const openWeatherMapApiKey = '6d0a77a68272df5d0b4f222227ef075f';

  // workarounds for hooks, because it fires useEffect on initial render, which we don't want.
  const timeToWaitToSearch = 750;
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const foundCity = find(Cities, { 'name': city });

      if (foundCity) {
        setCoords(foundCity.coord);
        forceUpdate();
      } else {
        setCityError("Unfortunately, city you've searched for is not found.");
      }

    }, timeToWaitToSearch)

    return () => clearTimeout(delayDebounceFn)
  }, [city])

  return (
    <div className="section">
      <div className="container">
        <div className="inputContainer">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {cityError && <h4>{cityError}</h4>}
        </div>

        {coords && <p>{console.log(coords)}</p>}

        {coords && (
          <div className="widgetContainer">
            <WeatherWidget
              className="weatherWidget"
              apiKey={openWeatherMapApiKey}
              geo={coords && coords}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
