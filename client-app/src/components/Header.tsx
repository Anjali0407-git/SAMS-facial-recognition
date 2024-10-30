// Header.js
import React from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the access token from localStorage
    localStorage.removeItem('token');
    // Clear the banner ID from localStorage
    localStorage.removeItem('bannerId');
    // Navigate to the login/register page
    navigate('/loginregisterpage');
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
          <Button color="inherit" onClick={handleLogout} style={{ position: 'absolute', right: 0, top: '10px' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;