import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const WeatherWidget = ({ weatherapiKey }) => {
  const [city, setCity] = useState("Kathmandu");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${weatherapiKey}`);
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();
        setWeatherData({
          temp: Math.round(data.main.temp),
          description: data.weather[0].main,
          icon: data.weather[0].icon,
          city: data.name,
        });
      } catch (error) {
        setError(error.message);
        setWeatherData(null);
      }
      setLoading(false);
    };
    fetchWeather();
  }, [city, weatherapiKey]);

  return (
    <section className="sidebar-section widgets">
      <h3>Weather</h3>
      <input
        className="widget-placeholder"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        aria-label="City for weather"
      />
      {loading ? (
        <p>Loading weather...</p>
      ) : error ? (
        <p>{error}</p>
      ) : weatherData ? (
        <div>
          <p><strong>{weatherData.city}</strong></p>
          <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt={weatherData.description} width="50" />
          <p>{weatherData.temp}°C - {weatherData.description}</p>
        </div>
      ) : (
        <p>No weather data</p>
      )}
    </section>
  );
};

WeatherWidget.propTypes = {
  weatherapiKey: PropTypes.string.isRequired,
};

export default WeatherWidget;
