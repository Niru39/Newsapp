import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import FeaturedArticle from "./FeaturedArticle";
import SecondaryFeaturedArticles from "./SecondaryFeaturedArticles";
import NewsSection from "./NewsSection";
import ArticleGrid from "./ArticleGrid";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
import SidebarLeft from "./sidebarLeft";
import SidebarRight from "./SidebarRight";
import "../css/NewsItem.css";
import "../css/News.css";
import "../App.css";

const News = ({
  apiKey,
  pageSize,
  setProgress,
  mode,
  toggleMode,
  country,
  weatherapiKey,
  stockapiKey,
  query,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const { categoryName, tagName } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [sections, setSections] = useState([]);

  const fallbackImage = "https://platform.theverge.com/wp-content/uploads/sites/2/2025/06/logitech1.jpg?quality=90&strip=all&crop=0%2C14.021425960412%2C100%2C71.957148079176&w=1200";

  const capitalizeFirstLetter = (string = "") =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const validCategories = [
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const fetchNews = async (pageNum = 1) => {
    try {
      setProgress(10);
      setLoading(true);

      let url = "";
      let queryToUse = "";

      if (categoryName) {
        queryToUse = categoryName.toLowerCase();
        url = validCategories.includes(queryToUse)
          ? `https://newsapi.org/v2/top-headlines?country=${country}&category=${queryToUse}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`
          : `https://newsapi.org/v2/everything?q=${encodeURIComponent(categoryName)}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      } else if (tagName) {
        queryToUse = tagName.toLowerCase();
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(tagName)}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      } else if (query) {
        queryToUse = query.toLowerCase();
        url = validCategories.includes(queryToUse)
          ? `https://newsapi.org/v2/top-headlines?country=${country}&category=${queryToUse}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`
          : `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      } else {
        queryToUse = "general";
        url = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      }

      const response = await fetch(url);
      setProgress(50);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      setProgress(80);

      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
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

  const fetchMultipleSections = async () => {
    setLoading(true);
    setProgress(10);
    const categories = [
      "general",
      "business",
      "technology",
      "sports",
      "health",
      "entertainment",
    ];

    try {
      const promises = categories.map(async (category) => {
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=6&apiKey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${category}`);
        const data = await res.json();
        return { category, articles: data.articles || [] };
      });

      const results = await Promise.all(promises);
      setSections(results);
      setLoading(false);
      setProgress(100);
    } catch (error) {
      console.error("Fetch multiple sections error:", error.message);
      setLoading(false);
      setProgress(100);
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      fetchMultipleSections();
    } else {
      const pageFromUrl = parseInt(searchParams.get("page")) || 1;
      fetchNews(pageFromUrl);
    }
  }, [location.pathname, categoryName, tagName, searchParams.toString()]);

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(searchQuery)} - NewsToday`;
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalResults / pageSize)) return;
    setSearchParams({ page: newPage });
  };

  return (
    <div className="news-page-container">
      <aside className="sidebar-left">
        <SidebarLeft />
      </aside>

      <main className="news-main">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>

        {location.pathname === "/" ? (
          <>
            {loading && <Spinner mode={mode} />}
            {!loading && (
              <>
                <h1 className="top-stories-heading">Top Stories</h1>

                <FeaturedArticle
                  article={sections[0]?.articles[0]}
                  fallbackImage={fallbackImage}
                />

                <SecondaryFeaturedArticles
                  articles={sections[0]?.articles.slice(1, 4)}
                  fallbackImage={fallbackImage}
                />

                {sections.map(({ category, articles }) => (
                  <NewsSection
                    key={category}
                    category={category}
                    articles={articles}
                    fallbackImage={fallbackImage}
                    sliceStart={category === "general" ? 4 : 0}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {loading && <Spinner mode={mode} />}
            {!loading && (
              <>
                <h1 className="top-stories-heading">
                  {capitalizeFirstLetter(categoryName || tagName)}
                </h1>

                <ArticleGrid
                  articles={articles}
                  fallbackImage={fallbackImage}
                />

                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(totalResults / pageSize)}
                  onPageChange={handlePageChange}
                />

                {page * pageSize >= totalResults && (
                  <p className="end-message">
                    You've reached the end of the news!
                  </p>
                )}
              </>
            )}
          </>
        )}
      </main>

      <aside className="sidebar-right">
        <SidebarRight
          newsApiKey={apiKey}
          weatherapiKey={weatherapiKey}
          stockapiKey={stockapiKey}
        />
      </aside>
    </div>
  );
};

News.defaultProps = {
  query: "general",
  pageSize: 6,
  country: "us",
};

News.propTypes = {
  query: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  pageSize: PropTypes.number,
  setProgress: PropTypes.func.isRequired,
  mode: PropTypes.string,
  toggleMode: PropTypes.func,
  weatherapiKey: PropTypes.string,
  stockapiKey: PropTypes.string,
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default News;
