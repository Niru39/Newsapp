import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const RecentUpdates = ({ apiKey }) => {
  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      try {
        const res = await fetch(`https://newsapi.org/v2/everything?q=general&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`);
        const data = await res.json();
        setRecentUpdates(data.status === "ok" ? data.articles : []);
      } catch {
        setRecentUpdates([]);
      }
    };
    fetchRecentUpdates();
  }, [apiKey]);

  return (
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
              <span>{article.title.length > 80 ? `${article.title.slice(0, 80)}...` : article.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

RecentUpdates.propTypes = {
  apiKey: PropTypes.string.isRequired,
};

export default RecentUpdates;
