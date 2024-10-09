import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <Button color="inherit" component={RouterLink} to="/registerstudent">
            Register Student
          </Button>
          <Button color="inherit" component={RouterLink} to="/capture">
            Capture Image
          </Button>
          <Button color="inherit" component={RouterLink} to="/dashboard">
            Attendance Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box textAlign="center" mt={4}>
          <img src='./face-recognition.png' alt="Logo" style={{ width: '400px' }} />
          <Typography variant="h4" gutterBottom>Welcome to Smart Attendace Management System</Typography>
          <Typography variant="body1">
            Use the links on the Navbar to register a student or capture an image.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
