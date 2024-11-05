import React, { FormEvent, useState } from 'react';
import {
  TextField, Button, MenuItem, InputLabel, FormControl, Select,
  Typography, Box, Snackbar,
  SelectChangeEvent
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Header from './Header';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const RegisterStudent: React.FC = () => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    bannerId: '',
    courseName: '',
    universityName: '',
    image: null as File | null,
    imageStr: '',
    student_email: '',
    student_password: ''
  });
    const [open, setOpen] = useState(false);
    type SeverityType = AlertColor | undefined;
    const [alertInfo, setAlertInfo] = useState<{ severity: SeverityType, message: string }>({ severity: 'info', message: '' });
    const [imageFileName, setImageFileName] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const name = event.target.name as keyof typeof student;
    const value = event.target.value as string;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     console.log('file', file)
  //   if (file && file.type.startsWith('image/')) {
  //       setStudent(prev => ({ ...prev, image: file }));
  //       setImageFileName(file.name); 
  //     setAlertInfo({ severity: 'success', message: 'Image uploaded successfully!' });
  //     setOpen(true);
  //   } else {
  //     setAlertInfo({ severity: 'error', message: 'Please upload a valid image file.' });
  //     setOpen(true);
  //   }
  // };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Once the file is read, set it as Base64 string to the student state
        setStudent(prev => ({ ...prev, image: file, imageStr: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setAlertInfo({ severity: 'success', message: 'Image uploaded successfully!' });
      setOpen(true);
    } else {
      setAlertInfo({ severity: 'error', message: 'Please upload a valid image file.' });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    if (!student.firstName || !student.lastName || !student.bannerId || !student.courseName || !student.universityName || !student.image || !student.student_email || !student.student_password) {
      setAlertInfo({ severity: 'error', message: 'All fields are mandatory. Please fill out each field.' });
      setOpen(true);
      return;
    }

    try {
      console.log('preparing data to launch', student)
      // Send the request to your backend
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}register_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: formData,
        body: JSON.stringify({
          first_name: student.firstName,
          last_name: student.lastName,
          banner_id: student.bannerId,
          course_name: student.courseName,
          university_name: student.universityName,
          image: student.imageStr,
          student_email: student.student_email,
          student_password: student.student_password
        }),
      });
  
      // Parse JSON response
      const result = await response.json();
  
      console.log(result);
      if(response.ok) {
        alert('Student registered successfully');
      } else {
        alert(result.detail);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register student');
    }
  };

    return (
      <div>
        <Header />
      <Box sx={{m: 6, p: 2}}><Typography variant="h3" gutterBottom>
      Register Student
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m:4 }}>
      
      <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="First Name" variant="outlined" name="firstName" value={student.firstName} onChange={handleInputChange} fullWidth sx={{ maxWidth: '25vw' }} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Last Name" variant="outlined" name="lastName" value={student.lastName} onChange={handleInputChange} fullWidth sx={{ maxWidth: '25vw' }} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Email" variant="outlined" name="student_email" value={student.student_email} onChange={handleInputChange} fullWidth sx={{ maxWidth: '25vw' }} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Password" type="password" variant="outlined" name="student_password" value={student.student_password} onChange={handleInputChange} fullWidth sx={{ maxWidth: '25vw' }} required />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Banner ID" variant="outlined" name="bannerId" value={student.bannerId} onChange={handleInputChange} fullWidth sx={{ maxWidth: '25vw' }} required/>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth sx={{ maxWidth: '25vw' }} required>
            <InputLabel>Course Name</InputLabel>
            <Select name="courseName" value={student.courseName} label="Course Name" onChange={handleSelectChange}>
              <MenuItem value="Course 1">Course 1</MenuItem>
              <MenuItem value="Course 2">Course 2</MenuItem>
            </Select>       
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth sx={{ maxWidth: '25vw' }} required>
            <InputLabel>University Name</InputLabel>
            <Select name="universityName" value={student.universityName} onChange={handleSelectChange}>
              <MenuItem value="University 1">University 1</MenuItem>
              <MenuItem value="University 2">University 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>
              
        <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {imageFileName && <Typography variant="body2" sx={{ ml: 2 }}>Uploaded: {imageFileName}</Typography>}
        </Grid>
        <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained" color="primary" sx={{ maxWidth: '25vw' }} fullWidth onClick={handleSubmit}>
                Register
            </Button>
        </Grid>
        </Grid>
                
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={alertInfo.severity}>
                {alertInfo.message}
            </Alert>
        </Snackbar>

    </Box>
    </Box>
    </div>
  );
};

export default RegisterStudent;
