# 📰 NewsApp

A modern and responsive news aggregator built with **React + Vite**, fetching news from [NewsAPI](https://newsapi.org/) , weather from [OpenWeatherMap](https://openweathermap.org/) and stock from [Finnhub] (https://finnhub.io/).  
Features include category/tag-based filtering, pagination, sidebar with live weather and stock data, and dark/light theme toggle.

---

##  Features

- Browse by category or search by keyword/tag
- Country-based top headlines
- Pagination for easy navigation
- Sidebar with real-time weather and stock updates
- Dark/light mode toggle
- Built with Vite for fast development

---



## Installation & Setup

1. Install dependencies
```bash
npm install
```

2. Create environment variables

Create a .env file in the root directory and add the following:
```
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_WEATHER_API_KEY=your_weatherapi_key_here
VITE_STOCK_API_KEY=your_stockapi_key_here
```
3. Start the development server
```
npm run dev
```
Then open your browser at:👉 http://localhost:5173

## Scripts

1. Start development server
```npm run dev```

2. Build for production
```npm run build```

3. Preview production build
```npm run preview```

## Built With

- React (via Vite)

- React Router DOM

- CSS for styling + themes

- NewsAPI.org

- Finnhub.io

- OpenWeatherMap.org
