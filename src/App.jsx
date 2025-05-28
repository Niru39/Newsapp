import './App.css';
import Navbar from './components/Navbar';
import News from './components/News';
import SearchNews from './components/Search';

import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import LoadingBar from "react-top-loading-bar";
import React, { useState } from 'react';
import NewsBanner from "./components/Newsbanner";
import AboutUs from './components/About';


const App = () => {
  const [mode, setMode] = useState('light');
  const [progress, setProgress] = useState(0);
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const weatherapiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const stockapiKey = import.meta.env.VITE_STOCK_API_KEY;
  const pageSize = 9;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  const toggleMode = () => {
    if (mode === 'dark') {
      setMode('light');
      document.body.classList.remove('dark-mode');
    } else {
      setMode('dark');
      document.body.classList.add('dark-mode');
    }
  };



  return (
    <div>
      <Navbar apiKey={apiKey} toggleMode={toggleMode} mode={mode} />
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

    
      <main>
        <NewsBanner apiKey={apiKey} country='us' />
       

        <Routes>
          {/* Dynamic category route */}
          <Route
            path="/category/:categoryName"
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                mode={mode}
                pageSize={pageSize}
                country="us"
                weatherapiKey={weatherapiKey}
                stockapiKey={stockapiKey}
              />
            }
          />

          {/* Dynamic tag route */}
          <Route
            path="/tag/:tagName"
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                mode={mode}
                pageSize={pageSize}
                country="us"
                weatherapiKey={weatherapiKey}
                stockapiKey={stockapiKey}
              />
            }
          />

          {/* Home route (general news) */}
          <Route
            path="/"
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                mode={mode}
                pageSize={pageSize}
                country="us"
                query="general"
                weatherapiKey={weatherapiKey}
                stockapiKey={stockapiKey}
              />
            }
          />

          {/* Search route */}
          <Route
            path="/search"
            element={<SearchNews apiKey={apiKey} mode={mode} pageSize={pageSize} />}
          />

         

          {/* About route */}
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
