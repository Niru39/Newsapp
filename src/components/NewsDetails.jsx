import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SidebarRight from './SidebarRight';
import '../css/NewsDetails.css';
import '../App.css';

const NewsDetails = ({ apiKey, weatherapiKey, stockapiKey }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    const currentArticle = location.state?.article || JSON.parse(localStorage.getItem('selectedArticle'));
    if (!currentArticle) {
      navigate('/');
    } else {
      setArticle(currentArticle);
      localStorage.setItem('selectedArticle', JSON.stringify(currentArticle));
      fetchRelatedNews(currentArticle.title);
    }
  }, [location.state]);

  const fetchRelatedNews = async (title) => {
    const keywords = title.split(' ').slice(0, 5).join(' ');
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&pageSize=5&apiKey=${apiKey}`
      );
      const data = await response.json();
      const filtered = data.articles.filter((a) => a.url !== article?.newsurl);
      setRelatedNews(filtered);
    } catch (error) {
      console.error('Failed to fetch related news:', error);
    }
  };

  if (!article) return null;

  const { title, description, imageurl, newsurl, author, date } = article;

  return (
    <div className="news-details-layout">
      <main className="news-details">
        <div className="news-details-container">
          <h1>{title}</h1>
          <img
            src={
              imageurl ||
              'https://platform.theverge.com/wp-content/uploads/sites/2/2025/06/logitech1.jpg?quality=90&strip=all&crop=0%2C14.021425960412%2C100%2C71.957148079176&w=1200'
            }
            alt={title}
            
          />
          <p><strong>By:</strong> {author || 'Unknown'}</p>
          <p><strong>Published on:</strong> {new Date(date).toLocaleString()}</p>
          <p>{description}</p>
          <Link to={newsurl} target="_blank" rel="noopener noreferrer">
            Read More...
          </Link>

          <h2>Related News</h2>
          <div className="related-news-container">
            {relatedNews.map((item, idx) => {
              const newArticle = {
                title: item.title,
                description: item.description,
                imageurl: item.urlToImage,
                newsurl: item.url,
                author: item.author,
                date: item.publishedAt
              };

              return (
                <div
                  key={idx}
                  className="related-news-card"
                  onClick={() => navigate('/article', { state: { article: newArticle } })}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={
                      !item.urlToImage
                        ? "https://platform.theverge.com/wp-content/uploads/sites/2/2025/06/logitech1.jpg?quality=90&strip=all&crop=0%2C14.021425960412%2C100%2C71.957148079176&w=1200"
                        : item.urlToImage
                    }
                    alt={item.title}
                    className="related-news-thumb"
                  />
                  <div className="related-news-info">
                    <h4 className="related-news-title">{item.title}</h4>
                    <p className="related-news-desc">{item.description?.slice(0, 80)}...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

export default NewsDetails;
