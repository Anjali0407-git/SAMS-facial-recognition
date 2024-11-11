import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

const Header = () => {
  const role = localStorage.getItem('role'); // Retrieve role from local storage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/home">Home</Button>
          {role === 'student' ? (
            <Button color="inherit" component={RouterLink} to="/dashboard">
              Attendance Dashboard
            </Button>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/registerstudent">
                Register Student
              </Button>
              <Button color="inherit" component={RouterLink} to="/capture">
                Capture Image
              </Button>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Attendance Dashboard
              </Button>
            </>
          )}
          <Button
            color="inherit"
            component={RouterLink}
            to="/loginregisterpage"
            onClick={handleLogout}
            style={{ position: 'absolute', right: 0, top: '10px' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
