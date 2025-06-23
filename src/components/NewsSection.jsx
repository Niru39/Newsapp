import React from "react";
import { Link } from "react-router-dom";
import NewsItem from "./Newsitem";

const NewsSection = ({ category, articles, fallbackImage, sliceStart = 0 }) => {
  return (
    <section className={`news-section news-section--${category.toLowerCase()}`}>
      <div className="section-header">
        <Link to={`/category/${category}`} className="more-link">
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)} »»</h2>
        </Link>
      </div>
      <div className="news-grid">
        {articles.slice(sliceStart).map((article) => (
          <NewsItem
            key={article.url}
            title={article.title?.slice(0, 60)}
            description={article.description?.slice(0, 100)}
            imageurl={article.urlToImage || fallbackImage}
            newsurl={article.url}
            author={article.author}
            date={article.publishedAt}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
