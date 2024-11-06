import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  TextField,
  IconButton,
  Snackbar,
  Modal,
  LinearProgress,
  CircularProgress,
  Fade,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';

interface CourseResponse {
  first_name: string;
  courses: string[];
  university_name?: string | null;
}

interface AttendanceRecord {
  student_name: string;
  student_id: string;
  timestamp: string;
  location_label: string;
}

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<string[]>([]);
  const [universityName, setUniversityName] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'error' | 'info' | 'success' | 'warning'
  });

  const bannerId = localStorage.getItem('bannerId');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!bannerId) {
        setSnackbar({
          open: true,
          message: 'No banner ID found. Please log in again.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/get_student_courses?bannerId=${bannerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data: CourseResponse = await response.json();
        setUniversityName(data.university_name || 'Unknown University');
        setCourses(data.courses);
        setStudentName(data.first_name);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load courses. Register to courses/Please try again later.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [bannerId]);

  const fetchAttendanceHistory = async (studentId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/get_attendance_logs?id=${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance history');
      }
      const data: AttendanceRecord[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      throw error;
    }
  };

  const handleCourseClick = async (course: string) => {
    setSelectedCourse(course);
    setAttendanceModalOpen(true);
    setAttendanceLoading(true);
    
    try {
      if (bannerId) {
        const attendanceData = await fetchAttendanceHistory(bannerId);
        setAttendanceHistory(attendanceData);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load attendance history',
        severity: 'error'
      });
    } finally {
      setAttendanceLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (attendanceHistory.length === 0) return 0;
    return (attendanceHistory.length / 30) * 100; // Assuming 30 days as total classes
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to Smart Attendance Management System
          </Typography>
          <Typography variant="h5" align="center" color="primary" gutterBottom>
            Hello, {studentName}!
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            {universityName}
          </Typography>
        </Box>

        {courses.length > 0 ? (
          <Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small" edge="start">
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <Grid container spacing={3}>
              {filteredCourses.map((course, index) => {
                const [courseCode, ...courseNameParts] = course.split(' ');
                const courseName = courseNameParts.join(' ');
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                      }}
                      onClick={() => handleCourseClick(course)}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: (theme) => theme.palette.primary.main,
                        }}
                      />
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 'bold', mb: 1 }}
                        >
                          {courseCode}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {courseName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          mt: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CalendarMonthIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          View Attendance History
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }} elevation={2}>
            <Typography variant="body1" color="text.secondary">
              No courses registered yet.
            </Typography>
          </Paper>
        )}

        <Modal
          open={attendanceModalOpen}
          onClose={() => setAttendanceModalOpen(false)}
          closeAfterTransition
        >
          <Fade in={attendanceModalOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 700,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2">
                  {selectedCourse} - Attendance History
                </Typography>
                <IconButton onClick={() => setAttendanceModalOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              {attendanceLoading ? (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress />
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Overall Attendance Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculateAttendanceRate()}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {calculateAttendanceRate().toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>

                  {attendanceHistory.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {attendanceHistory.map((record, index) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(record.timestamp)}</TableCell>
                              <TableCell>{formatTime(record.timestamp)}</TableCell>
                              <TableCell>{record.location_label}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No attendance records found.
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          message={snackbar.message}
        />
      </Container>
    </div>
  );
};

export default HomePage;