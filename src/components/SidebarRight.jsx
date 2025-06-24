import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/Sidebar.css';
import { Link } from 'react-router-dom';

const SidebarRight = ({ newsApiKey, weatherapiKey, stockapiKey }) => {
  const [mostReadArticles, setMostReadArticles] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const [city, setCity] = useState('Kathmandu');
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [stockError, setStockError] = useState(null);

  useEffect(() => {
    const fetchMostRead = async () => {
      try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=popular&sortBy=popularity&pageSize=5&apiKey=${newsApiKey}`)
        const data = await res.json();
        setMostReadArticles(data.status === 'ok' ? data.articles : []);
      } catch {
        setMostReadArticles([]);
      }
    };
    fetchMostRead();
  }, [newsApiKey]);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=general&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`);
        const data = await res.json();
        setRecentUpdates(data.status === 'ok' ? data.articles : []);
      } catch {
        setRecentUpdates([]);
      }
    };
    fetchRecentUpdates();
  }, [newsApiKey]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;
      setLoadingWeather(true);
      setWeatherError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${weatherapiKey}`
        );
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();
        setWeatherData({
          temp: Math.round(data.main.temp),
          description: data.weather[0].main,
          icon: data.weather[0].icon,
          city: data.name,
        });
      } catch (error) {
        setWeatherError(error.message);
        setWeatherData(null);
      }
      setLoadingWeather(false);
    };
    fetchWeather();
  }, [city, weatherapiKey]);

  useEffect(() => {
    const fetchStock = async () => {
      if (!stockSymbol) return;
      setLoadingStock(true);
      setStockError(null);
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${stockapiKey}`);
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
  }, [stockSymbol, stockapiKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setNewsletterMsg('Please enter a valid email.');
      return;
    }
    setNewsletterMsg(`Thanks for signing up, ${email}!`);
    setEmail('');
  };

  return (
    <aside className="sidebar sidebar-right">
      <section className="sidebar-section">
        <h3>Most Read</h3>
        <ul className="most-read-list">
          {mostReadArticles.length === 0 && <p>No articles found.</p>}
          {mostReadArticles.map((article) => (
            <li key={article.url} className="article-item">
              <Link to={article.url} target="_blank" rel="noopener noreferrer">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="article-thumb" />
                )}
                <span>
                  {article.title.length > 80 ? `${article.title.slice(0, 80)}...` : article.title}
                </span>
              </Link>
            </li>
          ))}

        </ul>
      </section>

      <section className="sidebar-section">
        <h3>Recent Updates</h3>
        <ul className="recent-updates-list">
          {recentUpdates.length === 0 && <p>No articles found.</p>}
          {recentUpdates.map((article) => (
            <li key={article.url} className="article-item">
              <Link to={article.url} target="_blank" rel="noopener noreferrer">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="article-thumb" />
                )}
                <span>
                  {article.title.length > 80 ? `${article.title.slice(0, 80)}...` : article.title}
                </span>
              </Link>
            </li>
          ))}

        </ul>
      </section>

      <section className="sidebar-section newsletter">
        <h3>Newsletter Signup</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="newsletter"
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
          className="widget-placeholder"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          aria-label="City for weather"
        />
        {loadingWeather ? (
          <p>Loading weather...</p>
        ) : weatherError ? (
          <p>{weatherError}</p>
        ) : weatherData ? (
          <div>
            <p><strong>{weatherData.city}</strong></p>
            <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt={weatherData.description} width="50" />
            <p>{weatherData.temp}°C - {weatherData.description}</p>
          </div>
        ) : (
          <p>No weather data</p>
        )}

        <h3>Stocks</h3>
        <input
          className="widget-placeholder"
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol"
          aria-label="Stock symbol"
        />
        {loadingStock ? (
          <p>Loading stock...</p>
        ) : stockError ? (
          <p>{stockError}</p>
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

SidebarRight.propTypes = {
  newsApiKey: PropTypes.string.isRequired,
  weatherapiKey: PropTypes.string.isRequired,
  stockapiKey: PropTypes.string.isRequired,
};

export default SidebarRight;
