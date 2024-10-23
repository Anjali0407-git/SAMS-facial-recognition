import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { format } from 'date-fns';
import Header from './Header';
import '../styles/loginRegister.css'
const Dashboard: React.FC = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedId, setSelectedID] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch attendance logs based on the selected date
  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const queryParams = [];
      if (selectedDate) {
        queryParams.push(`date=${selectedDate}`);
      }
      if (selectedId) {
        queryParams.push(`id=${selectedId}`);
      }

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

      const response = await fetch(`http://localhost:8000/get_attendance_logs${queryString}`);

  
      if (response.ok) {
        const data = await response.json();
        setAttendanceLogs(data);
        setSnackbarSeverity('success');
        setSnackbarMessage('Attendance logs fetched successfully!');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to fetch attendance logs.');
      }
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('An error occurred while fetching logs.');
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedID(event.target.value);
  };

  // Trigger fetch when the component mounts or the date changes
  useEffect(() => {
    fetchAttendanceLogs();
  }, [selectedDate]);

  // Handle closing of Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  return (<div><Header />
    
    <div className='dashboard-container'>
      <h2>Attendance Dashboard</h2>

      {/* Date input */}
      <div className="date-filter">
        <p>Select Date:</p>
      <TextField
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        sx={{ mb: 2 }}
      /></div>
    <div className="id-filter">
      <p>Enter Student ID:</p>
      <TextField
        type="text"
        value={selectedId}
        onChange={handleIDChange}
        label="Student ID"
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            padding: '4px 4px', // Increase padding to make the input taller
          },
          '& input': {
            height: '10px', // Optional: increase height for better control
          },
        }}
      />
    </div>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchAttendanceLogs}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Fetch Attendance Logs'}
      </Button>

      {/* Display logs in a table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Banner ID</TableCell>
              <TableCell>Time of Login</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceLogs.length > 0 ? (
              attendanceLogs.map((log: any, index) => (
                <TableRow key={index}>
                  <TableCell>{log.student_name}</TableCell>
                  <TableCell>{log.student_id}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.location_label}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No attendance records found for this date.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for feedback */}
      <Snackbar open={!!snackbarMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
    </div>
  );
};

export default Dashboard;
