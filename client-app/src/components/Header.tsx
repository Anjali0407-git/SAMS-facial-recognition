// Header.js
import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import '../styles/loginRegister.css'

const Header = () => {
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
          <Button className = "logout" color="inherit" component={RouterLink} to="/loginregisterpage">
          Logout</Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;