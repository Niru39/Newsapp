import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import FeaturedArticle from "./FeaturedArticle";
import SecondaryFeaturedArticles from "./SecondaryFeaturedArticles";
import NewsSection from "./NewsSection";
import StockWidget from "./StockWidget";
import MostRead from "./MostRead";
import TrendingTags from "./TrendingTags";
import RecentUpdates from "./RecentUpdates";
import TopCategories from "./TopCategories";
import NewsletterSignup from "./NewsletterSignup";
import ArticleGrid from "./ArticleGrid";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
import "../css/News.css";
import WeatherWidget from "./WeatherWidget";

const News = ({
  apiKey,
  pageSize,
  setProgress,
  mode,
  country,
  weatherapiKey,
  stockapiKey,
  query,
}) => {
  const { categoryName, tagName } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query || "");

  const fallbackImage =
    "https://platform.theverge.com/wp-content/uploads/sites/2/2025/06/logitech1.jpg?quality=90&strip=all&crop=0%2C14.021425960412%2C100%2C71.957148079176&w=1200";

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
          : `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            categoryName
          )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      } else if (tagName) {
        queryToUse = tagName.toLowerCase();
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          tagName
        )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      } else if (query) {
        queryToUse = query.toLowerCase();
        url = validCategories.includes(queryToUse)
          ? `https://newsapi.org/v2/top-headlines?country=${country}&category=${queryToUse}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`
          : `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            query
          )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
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
    const categories = ["general", "business", "technology", "sports", "health", "entertainment", "science"];
    try {
      const promises = categories.map(async (category) => {
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=5&apiKey=${apiKey}`;
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

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalResults / pageSize)) return;
    setSearchParams({ page: newPage });
  };

  const getSection = (name) =>
    sections.find((s) => s.category === name)?.articles || [];

  return (
    <div className="news-page-container custom-layout">
      {location.pathname === "/" ? (
        <>
          {loading && <Spinner mode={mode} />}
          {!loading && (
            <main>
              {/* Featured + Most Read */}
              {getSection("general").length > 0 && (
                <div className="row featured-mostread">
                  <div className="left">
                    <FeaturedArticle
                      article={getSection("general")[0]}
                      fallbackImage={fallbackImage}
                    />
                    <SecondaryFeaturedArticles
                      articles={getSection("general").slice(1, 4)}
                      fallbackImage={fallbackImage}
                    />
                  </div>
                  <div className="right">
                    <MostRead apiKey={apiKey} />
                  </div>
                </div>
              )}

              {/* Trending Tags */}
              {getSection("general").length > 0 && (
                <div className="row full-width">
                  <TrendingTags
                    tags={["COVID", "Elections", "Cannes", "Marvel", "Finance"]}
                  />
                </div>
              )}

              {/* Business */}
              {getSection("business").length > 0 && (
                <div className="row full-width">
                  <NewsSection
                    category="business"
                    articles={getSection("business")}
                    fallbackImage={fallbackImage}
                  />
                </div>
              )}

              {/* Technology + Recent Updates */}
              {getSection("technology").length > 0 && (
                <div className="row tech-recent">
                  <div className="left">
                    <NewsSection
                      category="technology"
                      articles={getSection("technology")}
                      fallbackImage={fallbackImage}
                    />
                  </div>
                  <div className="right">
                    <RecentUpdates apiKey={apiKey} />
                  </div>
                </div>
              )}

              {/* Sports */}
              {getSection("sports").length > 0 && (
                <div className="row full-width">
                  <TopCategories
                    categories={["Foods", "Internet", "Music", "Politics", "Accident", "Corruption"]}
                  />
                  <NewsSection
                    category="sports"
                    articles={getSection("sports")}
                    fallbackImage={fallbackImage}
                  />
                </div>
              )}

              {/* Health + Newsletter */}
              {getSection("health").length > 0 && (
                <div className="row health-newsletter">
                  <div className="left">
                    <NewsSection
                      category="health"
                      articles={getSection("health")}
                      fallbackImage={fallbackImage}
                    />
                  </div>
                  <div className="right">
                    <NewsletterSignup />
                  </div>
                </div>
              )}

              {/* Entertainment */}
              {getSection("entertainment").length > 0 && (
                <div className="row full-width">
                  <NewsSection
                    category="entertainment"
                    articles={getSection("entertainment")}
                    fallbackImage={fallbackImage}
                  />
                </div>
              )}

              {/* Science + Weather + Stock */}
              {getSection("science").length > 0 && (
                <div className="row weatherwidget-stockwidget">
                  <div className="left">
                    <NewsSection
                      category="science"
                      articles={getSection("science")}
                      fallbackImage={fallbackImage}
                    />
                  </div>
                  <div className="right">
                    <WeatherWidget weatherapiKey={weatherapiKey} />
                    <StockWidget stockapiKey={stockapiKey} />
                  </div>
                </div>
              )}
            </main>
          )}
        </>
      ) : (
        <>
          {loading && <Spinner mode={mode} />}
          {!loading && (
            <main>
              <h1>{searchQuery.toUpperCase()}</h1>
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
                <p>You've reached the end of the news!</p>
              )}
            </main>
          )}
        </>
      )}
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
  weatherapiKey: PropTypes.string,
  stockapiKey: PropTypes.string,
};

export default News;
