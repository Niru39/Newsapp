//import React, { Component } from 'react';
import './App.css';
import Navbar from './components/navbar';
import News from './components/News';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import LoadingBar from "react-top-loading-bar";
import React, { useState } from 'react';

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       mode: 'light',
//       progress:0
//     };
//   }

//   pageSize = 9;
//   apiKey = import.meta.env.VITE_NEWS_API_KEY;


//   setProgress =(progress)=>{
//     this.setState({progress:progress})
//   }

//   toggleMode = () => {
//     if (this.state.mode === 'dark') {
//       this.setState({ mode: 'light' });
//       document.body.classList.remove('dark-mode');
//     } else {
//       this.setState({ mode: 'dark' });
//       document.body.classList.add('dark-mode');
//     }
//   };

//   render() {
//     return (
//       <div>
//         <Navbar toggleMode={this.toggleMode} mode={this.state.mode} />
//         <LoadingBar
//         color="#f11946"
//         progress={this.state.progress}
//         />
//         <Routes>
//           <Route exact
//             path="/home"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="general" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="" />}
//           />
//           <Route exact
//             path="/about"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="about" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="" />}
//           />
//           <Route exact
//             path="/business"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="business" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="business" />}
//           />
//           <Route exact
//             path="/general"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="general" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="general" />}
//           />
//           <Route exact
//             path="/entertainment"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="entertainment" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="entertainment" />}
//           />
//           <Route exact
//             path="/health"
//             element={<News setProgress={this.setProgress} apikey={this.apikey} key="health" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="health" />}
//           />
//           <Route exact
//             path="/science"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="science" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="science" />}
//           />
//           <Route exact
//             path="/sports"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="sports" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="sports" />}
//           />
//           <Route exact
//             path="/technology"
//             element={<News setProgress={this.setProgress} apikey= {this.apikey} key="technology" mode={this.state.mode} pageSize = {this.pageSize} country="us" category="technology" />}
//           />
//         </Routes>
//         <Footer/>
//       </div>
//     );
//   }
// }




const App = () => {
  const [mode, setMode] = useState('light');
  const [progress, setProgress] = useState(0);

  const pageSize = 9;
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

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
          path="/home" element={<News
            setProgress={setProgress}
            apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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
              apikey={apiKey}
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

