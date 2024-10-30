import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import Header from './Header';
const HomePage: React.FC = () => {
  return (
    <div>
      <Header/>
    <>
      
      <Container maxWidth="sm">
        <Box textAlign="center" mt={4}>
          <img src='./face-recognition.png' alt="Logo" style={{ width: '400px' }} />
          <Typography variant="h4" gutterBottom>Welcome to Smart Attendance Management System</Typography>
          <Typography variant="body1">
            Use the links on the Navbar to register a student or capture an image.
          </Typography>
        </Box>
      </Container>
    </>
    </div>
  );
};

export default HomePage;
