import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../css/NewsBanner.css';
import { Link } from 'react-router-dom';
import '../App.css';

const NewsBanner = ({ apiKey, country }) => {
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTopHeadlines = async () => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=5&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.articles && data.articles.length > 0) {
        setHeadlines(data.articles);
      }
    } catch (error) {
      console.error("Error fetching top headlines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopHeadlines();
  }, [country]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        headlines.length > 0 ? (prevIndex + 1) % headlines.length : 0
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [headlines]);

  if (loading || headlines.length === 0) return null;

  const headline = headlines[currentIndex];

  return (
    <div className="news-banner">
      <p>
        <strong>Breaking News:</strong>{" "}
        <Link to={headline.url} target="_blank" rel="noopener noreferrer">
          {headline.title}
        </Link>
      </p>
    </div>
  );
};

NewsBanner.propTypes = {
  apiKey: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
};

export default NewsBanner;
