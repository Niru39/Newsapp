import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MostRead = ({ apiKey }) => {
  const [mostReadArticles, setMostReadArticles] = useState([]);

  useEffect(() => {
    const fetchMostRead = async () => {
      try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=popular&sortBy=popularity&pageSize=5&apiKey=${apiKey}`);
        const data = await res.json();
        setMostReadArticles(data.status === "ok" ? data.articles : []);
      } catch {
        setMostReadArticles([]);
      }
    };
    fetchMostRead();
  }, [apiKey]);

  return (
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
              <span>{article.title.length > 80 ? `${article.title.slice(0, 80)}...` : article.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

MostRead.propTypes = {
  apiKey: PropTypes.string.isRequired,
};

export default MostRead;
