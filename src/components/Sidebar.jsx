import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, weatherapiKey, stockapiKey }) => {
  const trendingTags = ['COVID', 'Elections', 'Cannes', 'Marvel', 'Finance'];
  const categories = ['Foods', 'Internet', 'Music', 'Politics', 'Accident', 'Corruption'];

  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const navigate = useNavigate();


  // For Weather widget
  const [country, setCountry] = useState('Nepal');
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // For Stocks widget
  const [stockSymbol, setStockSymbol] = useState('NRN');
  const [stockData, setStockData] = useState(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [stockError, setStockError] = useState(null);

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag.toLowerCase()}`);
    toggleSidebar();
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
    toggleSidebar();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setNewsletterMsg('Please enter a valid email.');
      return;
    }
    setNewsletterMsg(`Thanks for signing up, ${email}!`);
    setEmail('');
  };

  // Fetch Weather data when country changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!country) return;
      setLoadingWeather(true);
      setWeatherError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            country
          )}&units=metric&appid=${weatherapiKey}`
        );
        if (!res.ok) throw new Error('Country not found');
        const data = await res.json();
        setWeatherData({
          temp: Math.round(data.main.temp),
          description: data.weather[0].main,
        });
      } catch (error) {
        setWeatherError(error.message);
        setWeatherData(null);
      }
      setLoadingWeather(false);
    };
    fetchWeather();
  }, [country]);

  // Fetch Stock data when stockSymbol changes
  useEffect(() => {
    const fetchStock = async () => {
      if (!stockSymbol) return;
      setLoadingStock(true);
      setStockError(null);
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${stockapiKey}`
        );
        if (!res.ok) throw new Error('Stock symbol not found');
        const data = await res.json();
        setStockData({
          price: data.c.toFixed(2),
          change: ((data.c - data.pc) / data.pc * 100).toFixed(2),
        });
      } catch (error) {
        setStockError(error.message);
        setStockData(null);
      }
      setLoadingStock(false);
    };
    fetchStock();
  }, [stockSymbol]);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Close button for mobile */}
      {isOpen && (
        <button
          className="block md:hidden sidebar-close-btn"
          onClick={toggleSidebar}
          aria-label="Close Sidebar"
        >
          ×
        </button>
      )}


      <section className="sidebar-section">
        <h3>Trending Tags</h3>
        <div className="tags">
          {trendingTags.map((tag) => (
            <button key={tag} className="tag-btn" onClick={() => handleTagClick(tag)}>
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar-section">
        <h3>Categories</h3>
        <ul className="categories-list">
          {categories.map((category) => (
            <li key={category}>
              <button onClick={() => handleCategoryClick(category)}>{category}</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="sidebar-section newsletter">
        <h3>Newsletter Signup</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {newsletterMsg && <p className="newsletter-msg">{newsletterMsg}</p>}
      </section>

      <section className="sidebar-section widgets">
        <h3>Weather</h3>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Enter country"
          aria-label="Country for weather"
        />
        {loadingWeather ? (
          <p>Loading weather...</p>
        ) : weatherError ? (
          <p >{weatherError}</p>
        ) : weatherData ? (
          <div>
            <p>
              {weatherData.description}, {weatherData.temp}°C
            </p>
            <p>Location: {country}</p>
          </div>
        ) : (
          <p>No weather data</p>
        )}

        <h3>Stocks</h3>
        <input
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol"
          aria-label="Stock symbol"
        />
        {loadingStock ? (
          <p>Loading stock...</p>
        ) : stockError ? (
          <p >{stockError}</p>
        ) : stockData ? (
          <div>
            <p>
              {stockSymbol}: {stockData.price} ({stockData.change}%)
            </p>
          </div>
        ) : (
          <p>No stock data</p>
        )}
      </section>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  stockapiKey: PropTypes.string.isRequired,
  weatherapiKey: PropTypes.string.isRequired
};

export default Sidebar;
