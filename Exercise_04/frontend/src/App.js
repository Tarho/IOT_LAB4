import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Control from './Components/Control';
import style from './App.css'



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Control' element={<Control/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
