import React from "react";
import NewsItem from "./Newsitem";

const SecondaryFeaturedArticles = ({ articles, fallbackImage }) => {
  if (!articles?.length) return null;

  return (
    <section className="secondary-featured-articles">
      {articles.map((article) => (
        <NewsItem
          key={article.url}
          title={article.title}
          description={article.description}
          imageurl={article.urlToImage || fallbackImage}
          newsurl={article.url}
          author={article.author}
          date={article.publishedAt}
          isFeatured={true}
        />
      ))}
    </section>
  );
};

export default SecondaryFeaturedArticles;
