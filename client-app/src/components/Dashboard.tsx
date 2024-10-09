import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd')); // default to today's date
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch attendance logs based on the selected date
  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/get_attendance_logs?date=${selectedDate}`);
  
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

  // Trigger fetch when the component mounts or the date changes
  useEffect(() => {
    fetchAttendanceLogs();
  }, [selectedDate]);

  // Handle closing of Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  return (
    <div>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceLogs.length > 0 ? (
              attendanceLogs.map((log: any, index) => (
                <TableRow key={index}>
                  <TableCell>{log.student_name}</TableCell>
                  <TableCell>{log.student_id}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
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
  );
};

export default Dashboard;
