import '../App.css';
import '../css/NewsItem.css';
import { Link } from 'react-router-dom';

const NewsItem = (props) => {
  const {
    title,
    description,
    imageurl,
    newsurl,
    author,
    date,
    isFeatured = false,
    category
  } = props;

  const fallbackImage = "https://platform.theverge.com/wp-content/uploads/sites/2/2025/06/logitech1.jpg?quality=90&strip=all&crop=0%2C14.021425960412%2C100%2C71.957148079176&w=1200";
  const formattedDate = new Date(date).toLocaleString();

  const article = {
    title,
    description,
    imageurl,
    newsurl,
    author,
    date,
  };

  return (
    <Link
      to="/article"
      state={{ article }}
      className={`news-card-link ${isFeatured ? 'featured-news-card' : ''}`}
    >
      <div className={`news-card ${isFeatured ? 'featured-card' : ''}`}>
        {isFeatured ? (
          <div className="featured-wrapper">
            <img
              src={imageurl || fallbackImage}
              alt="news"
              className="featured-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />

            <div className="featured-content">
              <h2 className="featured-title">{title}</h2>
              <p className="featured-description">{description}</p>
              <p className="featured-meta">
                By {author || "Unknown"} on {formattedDate}
              </p>
            </div>
          </div>
        ) : (
          <div className="card-content">
            <img
              src={imageurl || fallbackImage}
              alt="news"
              className="card-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />

            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <small className="card-meta">
                By {author || "Unknown"} on {formattedDate}
              </small>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default NewsItem;
