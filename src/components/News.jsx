import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import FeaturedArticle from "./FeaturedArticle";
import SecondaryFeaturedArticles from "./SecondaryFeaturedArticles";
import NewsSection from "./NewsSection";
import MostRead from "./MostRead";
import TrendingTags from "./TrendingTags";
import HoroscopeWidget from "./HoroscopeWidget";
import RecentUpdates from "./RecentUpdates";
import NewsletterSignup from "./NewsletterSignup";
import ArticleGrid from "./ArticleGrid";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import StockWidget from "./StockWidget";
import { auth, db } from "../userAuth/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../css/News.css";

const News = ({
  apiKey,
  pageSize,
  setProgress,
  mode,
  country,
  query,
  horoscopeapiKey,
  stockapiKey,
}) => {
  const { categoryName, tagName } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [personalizedArticles, setPersonalizedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalizedLoading, setPersonalizedLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [newsApiFailed, setNewsApiFailed] = useState(false);
  const [userPrefs, setUserPrefs] = useState(null);

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

  // Fetch user preferences on mount and when auth changes
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setUserPrefs(null);
      return;
    }

    async function fetchUserPreferences() {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserPrefs(docSnap.data().preferences);
        } else {
          setUserPrefs(null);
        }
      } catch (err) {
        console.error("Failed to fetch user preferences:", err);
        setUserPrefs(null);
      }
    }

    fetchUserPreferences();
  }, [auth.currentUser]);

  // Fetch personalized news based on userPrefs
  const fetchPersonalizedNews = async () => {
    if (!userPrefs) {
      setPersonalizedArticles([]);
      return;
    }
    setPersonalizedLoading(true);
    try {
      const topics = userPrefs.topics || [];
      const customKeywords = userPrefs.customKeywords || [];
      let query = [...topics, ...customKeywords].join(" OR ");
      if (!query) query = "general";

      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&language=en&pageSize=20&apiKey=${apiKey}`;

      console.log("Fetching personalized news with URL:", url);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Personalized fetch failed");

      const data = await response.json();
      setPersonalizedArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching personalized news:", error);
      setPersonalizedArticles([]);
    } finally {
      setPersonalizedLoading(false);
    }
  };

  // Fetch multiple homepage sections excluding categories from userPrefs
  const fetchMultipleSections = async () => {
    setLoading(true);
    setProgress(10);
    setNewsApiFailed(false);

    // Build set of URLs from personalized articles to avoid duplicates
    const personalizedUrls = new Set(personalizedArticles.map((a) => a.url));

    // Extract valid categories from user preferences to exclude from homepage sections
    const userPrefCategories = (userPrefs?.topics || [])
      .map((t) => t.toLowerCase())
      .filter((t) => validCategories.includes(t));

    // Filter homepage categories to exclude user preferred categories
    const homepageCategories = [
      "general",
      "business",
      "technology",
      "sports",
      "health",
      "entertainment",
      "science",
    ].filter((cat) => !userPrefCategories.includes(cat));

    try {
      const promises = homepageCategories.map(async (category) => {
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=5&apiKey=${apiKey}`;
        console.log(`Fetching homepage section ${category} with URL:`, url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${category}`);
        const data = await res.json();

        // Filter out articles already shown in personalized section
        const filteredArticles = (data.articles || []).filter(
          (article) => !personalizedUrls.has(article.url)
        );

        return { category, articles: filteredArticles };
      });

      const results = await Promise.all(promises);
      setSections(results);
      setLoading(false);
      setProgress(100);
    } catch (error) {
      console.error("Fetch multiple sections error:", error.message);
      setNewsApiFailed(true);
      setSections([]); // ensure layout still works
      setLoading(false);
      setProgress(100);
    }
  };

  const fetchNews = async (pageNum = 1) => {
    try {
      setProgress(10);
      setLoading(true);
      setNewsApiFailed(false);

      let url = "";
      let queryToUse = "";

      if (categoryName) {
        queryToUse = categoryName.toLowerCase();
        if (validCategories.includes(queryToUse)) {
          url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${queryToUse}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
        } else {
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            categoryName
          )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
        }
      } else if (tagName) {
        queryToUse = tagName.toLowerCase();
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          tagName
        )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      } else if (query) {
        queryToUse = query.toLowerCase();
        if (validCategories.includes(queryToUse)) {
          url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${queryToUse}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
        } else {
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            queryToUse
          )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
        }
      } else if (userPrefs) {
        // fallback to user preferences only if no category/tag/query params
        const topics = userPrefs.topics || [];
        const customKeywords = userPrefs.customKeywords || [];

        if (topics.length > 0 && customKeywords.length === 0) {
          const category = topics[0].toLowerCase();
          const validCategory = validCategories.includes(category)
            ? category
            : null;

          if (validCategory) {
            queryToUse = validCategory;
            url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${validCategory}&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
          } else {
            queryToUse = topics.join(" OR ");
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
              queryToUse
            )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
          }
        } else if (customKeywords.length > 0) {
          const combinedQuery = [...topics, ...customKeywords].join(" OR ");
          queryToUse = combinedQuery;
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            combinedQuery
          )}&language=en&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
        } else {
          queryToUse = "general";
          url = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
        }
      } else {
        // default to general top headlines if nothing else matches
        queryToUse = "general";
        url = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&page=${pageNum}&pageSize=${pageSize}&apiKey=${apiKey}`;
      }

      console.log("FetchNews - category/tag/query:", queryToUse);
      console.log("FetchNews - URL:", url);

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
      setNewsApiFailed(true);
      setArticles([]);
      setLoading(false);
      setProgress(100);
    }
  };

  // Main effect: fetch news or sections based on route and userPrefs
  useEffect(() => {
    if (location.pathname === "/") {
      if (userPrefs) {
        // Fetch personalized news first, then fetch homepage sections excluding those categories
        (async () => {
          await fetchPersonalizedNews();
          await fetchMultipleSections();
        })();
      } else {
        fetchMultipleSections();
      }
    } else {
      const pageFromUrl = parseInt(searchParams.get("page")) || 1;
      fetchNews(pageFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.pathname,
    categoryName,
    tagName,
    searchParams.toString(),
    userPrefs,
    personalizedArticles.length,
  ]);

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
          {(loading || personalizedLoading) && <Spinner mode={mode} />}
          {!loading && !personalizedLoading && (
            <main >
           

              {/* Original homepage sections, filtered */}
              <div className="row featured-mostread">
                <div className="left">
                  {getSection("general").length > 0 ? (
                    <>
                      <FeaturedArticle
                        article={getSection("general")[0]}
                        fallbackImage={fallbackImage}
                      />
                      <SecondaryFeaturedArticles
                        articles={getSection("general").slice(1, 4)}
                        fallbackImage={fallbackImage}
                      />
                    </>
                  ) : (
                    <p>Featured content unavailable.</p>
                  )}
                </div>
                <div className="right">
                  <MostRead apiKey={apiKey} />
                </div>
              </div>

              <div className="row full-width">
                <TrendingTags
                  tags={["COVID", "Elections", "Cannes", "Marvel", "Finance"]}
                />
              </div>
                 {/* Personalized News Section */}
              {personalizedArticles.length > 0 && (
                <section className="personalized-news-section">
                  <h2>Your Personalized News</h2>
                  <ArticleGrid
                    articles={personalizedArticles}
                    fallbackImage={fallbackImage}
                  />
                </section>
              )}

              <div className="row full-width">
                {getSection("business").length > 0 && (
                  <NewsSection
                    category="business"
                    articles={getSection("business")}
                    fallbackImage={fallbackImage}
                  />
                )}
              </div>

              <div className="row full-width">
                <StockWidget stockapiKey={stockapiKey} />
              </div>

              <div className="row tech-horoscope">
                <div className="left">
                  {getSection("technology").length > 0 && (
                    <NewsSection
                      category="technology"
                      articles={getSection("technology")}
                      fallbackImage={fallbackImage}
                    />
                  )}
                </div>
                <div className="right">
                  <HoroscopeWidget horoscopeapiKey={horoscopeapiKey} />
                </div>
              </div>

              <div className="row full-width">
                {getSection("sports").length > 0 && (
                  <NewsSection
                    category="sports"
                    articles={getSection("sports")}
                    fallbackImage={fallbackImage}
                  />
                )}
              </div>

              <div className="row health-recent">
                <div className="left">
                  {getSection("health").length > 0 && (
                    <NewsSection
                      category="health"
                      articles={getSection("health")}
                      fallbackImage={fallbackImage}
                    />
                  )}
                </div>
                <div className="right">
                  <RecentUpdates apiKey={apiKey} />
                </div>
              </div>

              <div className="row science-newsletter">
                <div className="left">
                  {getSection("science").length > 0 && (
                    <NewsSection
                      category="science"
                      articles={getSection("science")}
                      fallbackImage={fallbackImage}
                    />
                  )}
                </div>
                <div className="right">
                  <NewsletterSignup />
                </div>
              </div>

              <div className="row full-width">
                {getSection("entertainment").length > 0 && (
                  <NewsSection
                    category="entertainment"
                    articles={getSection("entertainment")}
                    fallbackImage={fallbackImage}
                  />
                )}
              </div>
            </main>
          )}
        </>
      ) : (
        <>
          {loading && <Spinner mode={mode} />}
          {!loading && (
            <main>
              <h1>{searchQuery.toUpperCase()}</h1>
              <ArticleGrid articles={articles} fallbackImage={fallbackImage} />
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
  horoscopeapiKey: PropTypes.string,
  stockapiKey: PropTypes.string,
};


export default News;
