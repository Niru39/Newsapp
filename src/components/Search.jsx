import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SearchNews = ({ apiKey, pageSize }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const capitalizeFirstLetter = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      setArticles([]);

      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "ok") {
          setArticles(data.articles);
        } else {
          setError(data.message || "Failed to fetch news");
        }
      } catch (err) {
        setError("Network error, please try again.");
      }

      setLoading(false);
    };

    fetchSearchResults();
  }, [query, apiKey, pageSize]);

  return (
    <div className="search-news-wrapper">
      <h2>Search Results for {capitalizeFirstLetter(query)} </h2>

      {loading && <p>Loading...</p>}
      {error && {error}}

      <div className="card-container">
        {articles.map((article, i) => (
          <div key={i} className="news-card">
             {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} />
            )}
            <Link to={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
            </Link>

            <p>{article.description}</p>
            <small>By {!article.author?"Unknown": article.author} on {new Date(article.publishedAt).toGMTString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchNews;
