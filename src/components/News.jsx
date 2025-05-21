
import NewsItem from './Newsitem';
import '../App.css';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState } from 'react';




const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      props.setProgress(40);

      if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }

      const parsedData = await response.json();
      props.setProgress(70);

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      props.setProgress(100);
      
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;

    try {
      const response = await fetch(url);
      const parsedData = await response.json();

      setArticles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsToday`;
    updateNews();
    
  }, [props.category]);

  return (
    <div className="news-wrapper">
      <h2 className="news-title">
        Latest News - {capitalizeFirstLetter(props.category)}
      </h2>

      {loading && articles.length === 0 && (
        <Spinner toggleMode={props.toggleMode} mode={props.mode} />
      )}
      {articles && articles.length > 0 && (

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner toggleMode={props.toggleMode} mode={props.mode} />}
      >
        <div className="news-container">
          {articles.map((element) => (
            <NewsItem
              key={element.url}
              title={element.title ? element.title.slice(0, 45) : ''}
              description={element.description ? element.description.slice(0, 88) : ''}
              imageurl={element.urlToImage}
              newsurl={element.url}
              author={element.author}
              date={element.publishedAt}
            />
          ))}
        </div>
      </InfiniteScroll>
      )}
    </div>
  );
};

News.defaultProps = {
  country: 'US',
  pageSize: 6,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
  toggleMode: PropTypes.func,
  mode: PropTypes.string,
};

export default News;
