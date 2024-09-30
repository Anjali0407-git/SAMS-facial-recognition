// src/features/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

const HomePage: React.FC = () => {
  return (
    <div>
        <Link to="/registerstudent">
          <button className="App-link">Register Student</button>
      </Link>
      <Link to="/capture">
          <button className="App-link">Capture Image</button>
      </Link>
    </div>
  );
};

export default HomePage;
