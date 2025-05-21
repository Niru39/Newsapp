//import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import News from './components/News';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import LoadingBar from "react-top-loading-bar";
import React, { useState } from 'react';

const App = () => {
  const [mode, setMode] = useState('light');
  const [progress, setProgress] = useState(0);
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  

  const pageSize = 9;


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
      <Navbar toggleMode={toggleMode} mode={mode} />
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>
        <Route exact
          path="/" element={<News
            setProgress={setProgress}
            apiKey={apiKey}
            key="general"
            mode={mode}
            pageSize={pageSize}
            country="us"
            category="general"
          />
          }
        />
        <Route exact
          path="/about"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="about"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="general"
            />
          }
        />
        <Route exact
          path="/business"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="business"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="business"
            />
          }
        />
        <Route exact
          path="/general"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="general"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="general"
            />
          }
        />
        <Route exact
          path="/entertainment"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="entertainment"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="entertainment"
            />
          }
        />
        <Route exact
          path="/health"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="health"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="health"
            />
          }
        />
        <Route exact
          path="/science"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="science"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="science"
            />
          }
        />
        <Route exact
          path="/sports"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="sports"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="sports"
            />
          }
        />
        <Route exact
          path="/technology"
          element={
            <News
              setProgress={setProgress}
              apiKey={apiKey}
              key="technology"
              mode={mode}
              pageSize={pageSize}
              country="us"
              category="technology"
            />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

