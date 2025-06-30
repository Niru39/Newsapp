import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import '../css/StockWidget.css'

const stockSymbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NFLX", "META", "NVDA"];

const StockWidget = ({ stockapiKey }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchAllStocks = async () => {
      try {
        const responses = await Promise.all(
          stockSymbols.map(symbol =>
            fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${stockapiKey}`)
              .then(res => res.json())
              .then(data => ({
                symbol,
                price: data.c.toFixed(2),
                change: ((data.c - data.pc) / data.pc * 100).toFixed(2),
              }))
          )
        );
        setStocks(responses);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchAllStocks();
    const interval = setInterval(fetchAllStocks, 3000); 
    return () => clearInterval(interval);
  }, [stockapiKey]);

  return (
    <div className="stock-ticker-bar">
      <h3> Stocks</h3>
      <div className="ticker-content">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="stock-item">
            <span className="symbol">{stock.symbol}</span>
            <span className="price">${stock.price}</span>
            <span
              className={`change ${
                parseFloat(stock.change) >= 0 ? "positive" : "negative"
              }`}
            >
              ({stock.change}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

StockWidget.propTypes = {
  stockapiKey: PropTypes.string.isRequired,
};

export default StockWidget;
