import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { Button, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user" as const
};

const WebcamComponent: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log('position', position)
      setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    })
          
  }, []);
  
  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          setLoading(true);

          // Send the request to your backend
          const response = await fetch('http://localhost:8000/facial_recognition', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encoded_image: imageSrc, latitude: location.latitude, longitude: location.longitude }),
          });

          // Parse JSON response
          const result = await response.json();

          if(response.ok) {
            setSnackbarSeverity('success');
            setSnackbarMessage(`Welcome ${result.student_name}, attendance marked successfully!`);
          } else {
            setSnackbarSeverity('error');
            setSnackbarMessage(result.detail || 'Failed to recognize face.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to register student');
        } finally {
          setLoading(false);
        }
      }
    }
  }, [location]);

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  return (
    <Box textAlign="center" sx={{ mt: 2 }}>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={capture}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
        >
          {loading ? 'Processing...' : 'Capture & Verify'}
        </Button>
      </Box>
      
      {/* Snackbar for feedback */}
      <Snackbar open={!!snackbarMessage} autoHideDuration={8000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WebcamComponent;
