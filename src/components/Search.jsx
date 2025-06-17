import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import '../css/Search.css';
import '../App.css';

const SearchNews = ({ apiKey, pageSize }) => {
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page")) || 1;
  

  const capitalizeFirstLetter = (string = '') =>
    string.charAt(0).toUpperCase() + string.slice(1);
  
  const fetchSearchResults = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);
    setArticles([]);

    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "ok") {
        setArticles(data.articles);
        setTotalResults(data.totalResults);
      } else {
        setError(data.message || "Failed to fetch news");
      }
    } catch (err) {
      setError("Network error, please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query, page]);

  const totalPages = Math.ceil(totalResults / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ q: query, page: newPage });
  };
   

  return (
    <div className="search-news-wrapper">
      <h2>Search Results for {capitalizeFirstLetter(query)}</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="card-container">
        {articles.map((article, i) => (
          <div key={i} className="news-card">
            {article.urlToImage && <img src={article.urlToImage} alt={article.title}  />}
            <Link to={article.url} target="_blank" rel="noopener noreferrer" >
              {article.title} 
            </Link>
            <p>{article.description}</p>
            <small>
              By {!article.author ? "Unknown" : article.author} on{" "}
              {new Date(article.publishedAt).toLocaleString()}            </small>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>Previous</button>
          <span> Page {page} of {totalPages} </span>
          <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};
 
export default SearchNews;
