import React from 'react';
import WeatherWidget from '@eggtronic/react-weather-widget';
import './App.scss';

function App() {
  const openWeatherMapApiKey = '6d0a77a68272df5d0b4f222227ef075f';

  return (
    <div className="section">
      <div className="container">
        <input type="text" name="city" placeholder="City..." />

        <WeatherWidget apiKey={openWeatherMapApiKey} />
      </div>
    </div>
  );
}

export default App;
