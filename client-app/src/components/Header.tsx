// Header.js
import React from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import '../styles/loginRegister.css'

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();  // This clears the token and bannerId
    //navigate('/login');    // Redirect to the login page
  };
  return (
    <header className='header-container'>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/home">Home</Button>
          <Button color="inherit" component={RouterLink} to="/registerstudent">
            Register Student
          </Button>
          <Button color="inherit" component={RouterLink} to="/capture">
            Capture Image
          </Button>
          <Button color="inherit" component={RouterLink} to="/dashboard">
            Attendance Dashboard
          </Button>
          <Button className = "logout" color="inherit" onClick={handleLogout} component={RouterLink} to="/loginregisterpage">
          Logout</Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;