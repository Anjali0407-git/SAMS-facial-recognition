import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <h1 className="main-title">SAMS</h1> 
        <p className="main-para">
        Welcome to Smart Attendance Management System
        </p>
        <div className="buttons">
          <Link to="/loginregisterpage">
            <button className="primary-button">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
