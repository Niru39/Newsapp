
import '../App.css'; 

const NewsItem =(props)=> {
  
    const { title, description, imageurl, newsurl, author,date } = props;
    console.log(props);
    return (
      <div className="news-card">
        <div className="card-content">
          <img src={!imageurl?"https://image.cnbcfm.com/api/v1/image/108139388-1746113870201-NYSE_Traders-OB-Photo-20250501-CC-PRESS-4.jpg?v=1746114141&w=1920&h=1080":imageurl} alt="news" className="card-image" />
          <div className="card-body">
            <h5 className="card-title">{title} ...</h5>
            <p className="card-text">{description}...</p>
            <p className="card-text">By {!author?"Unknown": author} on {new Date(date).toGMTString()}</p>
            <a href={newsurl} target="_blank" rel="noreferrer" className="read-more-btn">
              Read more
            </a>
          </div>
        </div>
      </div>
    );
  }


export default NewsItem;
