import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, TableContainer, Paper,  Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Header from './Header';

interface CourseResponse {
  first_name: string;
  courses: string[];
  university_name?: string | null;  // Make this field optional and allow nulls
}

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<string[]>([]);
  const [universityName, setUniversityName] = useState<string>('');  // universityName is a string
  const [studentName, setStudentName] = useState<string>('');

  // Assuming bannerId is stored in localStorage after login
  const bannerId: string | null = localStorage.getItem('bannerId');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!bannerId) {
        console.log('No bannerId found in localStorage');
        return;
      }

      console.log(`Making API request with bannerId: ${bannerId}`);
      try {
        const response = await fetch(`http://localhost:8000/get_student_courses?bannerId=${bannerId}`);
        
        console.log('API request made, waiting for response...');
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data: CourseResponse = await response.json();
        console.log('Received data:', data);

        // Ensure university_name is a string, provide a fallback if it's null or undefined
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
      day: 'numeric',
      timeZone: 'America/Chicago',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Chicago',
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
      <Container maxWidth="sm">
        <Box textAlign="center" mt={4}>
          <Typography variant="h4" gutterBottom>
            Welcome to Smart Attendance Management System, {studentName}!
          </Typography>

          {courses.length > 0 ? (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Registered Courses at {universityName}:
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Name:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="body2" mt={2}>
              No courses registered yet.
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
