import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { Link } from 'react-router-dom';

const NewsBanner = ({ apiKey, country }) => {
  const [headline, setHeadline] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const fetchTopHeadline = async () => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=1&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.articles && data.articles.length > 0) {
        setHeadline(data.articles[0]);
      }
    } catch (error) {
      console.error("Error fetching top headline:", error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchTopHeadline();
  }, [country]);

  if (loading) return null;

  return (
    headline && (
      <div className="news-banner">
        <p><strong>Breaking News:</strong> <Link to={headline.url} target="_blank" rel="noopener noreferrer">{headline.title}</Link></p>
      </div>
    )
  );
};

NewsBanner.propTypes = {
  apiKey: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
};

export default NewsBanner;
