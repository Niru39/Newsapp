import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const StockWidget = ({ stockapiKey }) => {
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      if (!stockSymbol) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${stockapiKey}`);
        if (!res.ok) throw new Error("Stock symbol not found");
        const data = await res.json();
        setStockData({
          price: data.c.toFixed(2),
          change: ((data.c - data.pc) / data.pc * 100).toFixed(2),
        });
      } catch (error) {
        setError(error.message);
        setStockData(null);
      }
      setLoading(false);
    };
    fetchStock();
  }, [stockSymbol, stockapiKey]);

  return (
    <section className="sidebar-section widgets">
      <h3>Stocks</h3>
      <input
        className="widget-placeholder"
        type="text"
        value={stockSymbol}
        onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol"
        aria-label="Stock symbol"
      />
      {loading ? (
        <p>Loading stock...</p>
      ) : error ? (
        <p>{error}</p>
      ) : stockData ? (
        <div>
          <p>{stockSymbol}: {stockData.price} ({stockData.change}%)</p>
        </div>
      ) : (
        <p>No stock data</p>
      )}
    </section>
  );
};

StockWidget.propTypes = {
  stockapiKey: PropTypes.string.isRequired,
};

export default StockWidget;
