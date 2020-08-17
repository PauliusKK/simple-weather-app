import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { find } from 'lodash';
import Cities from './city.list.json';
import './App.scss';

// TODO:
// get user location.

function App() {
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState(undefined);
  const [forecastList, setForecastList] = useState(undefined);

  const openWeatherMapApiKey = '6d0a77a68272df5d0b4f222227ef075f';
  const weatherDataUnits = 'metric';

  const timeToWaitToSearch = 750;
  useEffect(() => {
    if (!city) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const foundCity = find(Cities, { 'name': city });

      if (foundCity) {
        setCityError("City found! Loading weather...");

        axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${foundCity.name}&units=${weatherDataUnits}&appid=${openWeatherMapApiKey}`)
          .then(function (weather) {
            setCityError(undefined);

            const weatherForecastList = weather.data.list.map((forecast) => {
              const { dt, main, weather, wind } = forecast;
              const { temp: temperature, feels_like: feelsLike, humidity } = main;
              const { main: weatherTitle, description: weatherDescription } = weather[0];
              const date = moment.unix(dt).utcOffset('+0200').format('YYYY-MM-DD HH:mm');
              return { date, temperature, feelsLike, humidity, weatherTitle, weatherDescription };
            });

            setForecastList(weatherForecastList);
          })
          .catch(function (error) {
            console.log(error);
            setCityError("Oops! Weather could not be loaded. Contact support.");
          })

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
          <label>City</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {cityError && <h4>{cityError}</h4>}
        </div>

        <div className="forecasts">
          {forecastList && (
            <div>
              <h2>Forecast for 5 days (every 3 hours)</h2>

              {forecastList.map((forecast) => {
                const { feelsLike, humidity, temperature, date, weatherDescription, weatherTitle } = forecast;

                return (
                  <div className="forecast">
                    <h4>Date: <span>{date}</span></h4>
                    <p>Temperature: <strong>{temperature} ℃</strong></p>
                    <p>Feels like: <strong>{feelsLike} ℃</strong></p>
                    <p>Humidity: <strong>{humidity}%</strong></p>
                    <h4>Weather:</h4>
                    <p>Title: <strong>{weatherTitle}</strong></p>
                    <p>Description: <strong>{weatherDescription}</strong></p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
