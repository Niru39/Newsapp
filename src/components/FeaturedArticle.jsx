import React from "react";
import NewsItem from "./Newsitem";

const FeaturedArticle = ({ article, fallbackImage }) => {
  if (!article) return null;

  return (
    <section className="featured-article">
      <NewsItem
        title={article.title}
        description={article.description}
        imageurl={article.urlToImage || fallbackImage}
        newsurl={article.url}
        author={article.author}
        date={article.publishedAt}
        isFeatured={true}
      />
    </section>
  );
};

export default FeaturedArticle;
