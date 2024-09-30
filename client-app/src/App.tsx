// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Make sure the path is correct
import RegisterStudent from './components/RegisterStudent'; // Adjust the path as necessary
import './App.css';
import WebcamComponent from './components/Webcam';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registerstudent" element={<RegisterStudent />} />
          <Route path="/capture" element={<WebcamComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
