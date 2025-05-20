//import React, { Component } from 'react';
import NewsItem from './Newsitem';
import '../App.css';
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState } from 'react';

// export class News extends Component {
//   static defaultProps = {
//     country: 'US',
//     pageSize: 6,
//     category: 'general'
//   }

//   static propTypes = {
//     country: PropTypes.string,
//     pageSize: PropTypes.number,
//     category: PropTypes.string

//   }

//   capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }
  

//   // constructor initial state set garna ko lagi use hunxa
//   constructor(props) {
//     super(props); // parent class(component) constructor lai call garxa
//     this.state = {
//       articles: [], //to initilaze  empty array for holding fetched articles
//       loading: true,
//       page: 1, 
//       totalResults:0
//     };
//     document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsToday`;

//   }

//   async updateNews() {
//     this.props.setProgress(10);
//     const url = `https://newsapi.org/v2/top-headlines?&country=${this.props.country}&category=${this.props.category}&apikey=${this .props.apikey}&page=${this.state.page}&pagesize=${this.props.pageSize}`;

//     try {
//       this.setState({ loading: true });
//       let response = await fetch(url);
//       this.props.setProgress(40);

//       if (response.status === 429) {
//         throw new Error('Too many requests. Please try again later.');
//       }

//       let parsedData = await response.json();
//       this.props.setProgress(70);

//       this.setState({
//         articles: parsedData.articles,
//         totalResults: parsedData.totalResults,
//         loading: false,
//       });
//       this.props.setProgress(100);

//     } catch (error) {
//       console.error(error.message);
//       this.setState({ loading: false });
//     }
//   }



//   //componentDidMount le logic excute garxa component screen ma aayesi jastai data fetch vayesi
//   async componentDidMount() {

//     this.updateNews();

//   }

//   // handlePrevClick = async () => {

//   //   this.setState({ page: this.state.page - 1 });
//   //   this.updateNews();

//   // }

//   // handleNextClick = async () => {

//   //   this.setState({ page: this.state.page + 1 });
//   //   this.updateNews();


// fetchMoreData = async() => {
//      this.setState({page: this.state.page +1})
//      const url = `https://newsapi.org/v2/top-headlines?&country=${this.props.country}&category=${this.props.category}&apikey=${thiis.props.apikey}&page=${this.state.page}&pagesize=${this.props.pageSize}`;
//      let response = await fetch(url);  
//      let parsedData = await response.json();
//      this.setState({
//         articles: this.state.articles.concat(parsedData.articles),
//         totalResults: parsedData.totalResults,
//        });
 
     
//   };


//   render() {
//     console.log("render");
//     return (
//       <div className="news-wrapper">
//         <h2 className="news-title">Latest News</h2>

//         {/* Show loading spinner when loading state is true
//         {this.state.loading && <Spinner toggleMode={this.toggleMode} mode={this.state.mode} />}

//         {/* Render articles when loading is false */}
//         {/* {!this.state.loading && ( */}

//          {/* Show spinner initially before first fetch completes */}
//       {this.state.loading && this.state.articles.length === 0 && <Spinner toggleMode={this.toggleMode} mode={this.state.mode} />}

  
//         <InfiniteScroll
//             dataLength={this.state.articles.length}
//             next={this.fetchMoreData}
//             hasMore={this.state.articles.length < this.state.totalResults}
//             loader= {<Spinner toggleMode={this.toggleMode} mode={this.state.mode} />}>

//         <div className="news-container">
         
//           {this.state.articles.map((element) => (
//             <NewsItem
//               key={element.url}
//               title={element.title ? element.title.slice(0, 45) : ""}
//               description={element.description ? element.description.slice(0, 88) : ""}
//               imageurl={element.urlToImage}
//               newsurl={element.url}
//               author={element.author}
//               date={element.publishedAt}

//             />
//           ))}
//         </div>
              
//         </InfiniteScroll>
//         {/* // )} */}

//         {/* Pagination buttons
//         <div className="pagination-button">
//           <button
//             disabled={this.state.page <= 1}
//             className='pagination-btn'
//             onClick={this.handlePrevClick}>
//             &laquo; Previous
//           </button>

//           <span className="page-indicator">Page {this.state.page}</span>

//           <button
//             disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
//             className='pagination-btn'
//             onClick={this.handleNextClick}>
//             Next &raquo;
//           </button>
//         </div> */}
//       </div>
//     );
//   }
// }

// export default News



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
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${process.env.VITE_NEWS_API_KEY}&page=${page}&pageSize=${props.pageSize}`;

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
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=bb77591fb68a41a39a7be3881de44fe2&page=${nextPage}&pageSize=${props.pageSize}`;

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
  apikey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
  toggleMode: PropTypes.func,
  mode: PropTypes.string,
};

export default News;
