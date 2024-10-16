import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; 
import RegisterStudent from './components/RegisterStudent'; 
import LoginRegisterPage from './components/LoginRegisterPage';
import LandingPage from './components/LandingPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import WebcamComponent from './components/Webcam';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registerstudent" element={<RegisterStudent />} />
        <Route path="/loginregisterpage" element={<LoginRegisterPage />} />
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/capture" element={<WebcamComponent />} />
      </Routes>
    </div>
  );
}

export default App;
