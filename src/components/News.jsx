import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import NewsItem from './Newsitem';
import Spinner from './Spinner';
import Sidebar from './Sidebar';
import Pagination from './Pagination';
import '../App.css';


const News = (props) => {
  const { query, apiKey, pageSize, setProgress, mode, toggleMode, country, weatherapiKey, stockapiKey } = props;

  const { categoryName, tagName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();


  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const capitalizeFirstLetter = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

 const fetchNews = async (pageNum = 1) => {
  try {
    setProgress(10);
    setLoading(true);

    let url = '';
    let queryToUse = '';

    if (categoryName) {
      queryToUse = categoryName;
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(categoryName)}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
    } else if (tagName) {
      queryToUse = tagName;
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(tagName)}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      
    } else if (query) {
      queryToUse = query;
      url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${query}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
    } else {
      throw new Error("No valid query provided.");
    }

    const response = await fetch(url);
    setProgress(50);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const parsedData = await response.json();
    setProgress(80);

    if (!parsedData.articles || parsedData.articles.length === 0) {
      throw new Error("No articles found.");
    }

    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setPage(pageNum);
    setSearchQuery(queryToUse);
    setLoading(false);
    setProgress(100);
  } catch (error) {
    console.error("Fetch error:", error.message);
    setLoading(false);
    setProgress(100);
  }
};


useEffect(() => {
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  fetchNews(pageFromUrl);
}, [location.pathname, searchParams.toString()]);


  useEffect(() => {
    document.title = `${capitalizeFirstLetter(searchQuery)} - NewsToday`;
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalResults / pageSize)) return;
    setSearchParams({ page: newPage });
  };

 



  return (
    <div className="news-page">
      {/* Sidebar Section */}
      <aside className={`news-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} weatherapiKey={weatherapiKey} stockapiKey={stockapiKey} />
      </aside>

      {/* Main Content Section */}
      <main className="news-main">
        {/* Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>

        <h2 className="news-title">
          Latest News of {capitalizeFirstLetter(searchQuery)} in {country.toUpperCase()}
        </h2>

        {loading && <Spinner toggleMode={toggleMode} mode={mode} />}

        {!loading && (
          <>
            <div className="news-grid">
              {articles.map(article => (
                <NewsItem
                  key={article.url}
                  title={article.title?.slice(0, 45)}
                  description={article.description?.slice(0, 88)}
                  imageurl={article.urlToImage}
                  newsurl={article.url}
                  author={article.author}
                  date={article.publishedAt}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalResults / pageSize)}
              onPageChange={handlePageChange}
            />

            {articles.length >= totalResults && (
              <p className="end-message">You've reached the end of the news!</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

News.defaultProps = {
  query: 'general',
  pageSize: 6,
  country: 'np',
};

News.propTypes = {
  query: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  pageSize: PropTypes.number,
  setProgress: PropTypes.func.isRequired,
  toggleMode: PropTypes.func,
  mode: PropTypes.string,
  weatherapiKey:PropTypes.string.isRequired,
  stockapiKey: PropTypes.string.isRequired
};

export default News;
