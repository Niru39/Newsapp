import React from "react";
import NewsItem from "./Newsitem";

const ArticleGrid = ({ articles, fallbackImage }) => (
  <div className="news-grid">
    {articles.map((article) => (
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
);

export default ArticleGrid;
