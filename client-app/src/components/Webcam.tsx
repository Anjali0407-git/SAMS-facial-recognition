import React, { useState, useCallback, useRef } from 'react';
import Webcam from "react-webcam";
import { Button, Snackbar, Alert, CircularProgress } from '@mui/material';
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

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        console.log(imageSrc);
        try {
          setLoading(true);

          // Send the request to your backend
          const response = await fetch('http://localhost:8000/facial_recognition', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
              encoded_image: imageSrc
            }),
          });
      
          // Parse JSON response
          const result = await response.json();
      
          console.log(result);
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
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={capture}
        disabled={loading}
        startIcon={loading ? <CircularProgress />: <PhotoCameraIcon />}
      >
        {loading ? 'Processing...' : 'Capture & Verify'}
      </Button>
      
      {/* Snackbar for feedback */}
      <Snackbar open={!!snackbarMessage} autoHideDuration={8000} onClose={handleCloseSnackbar}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WebcamComponent;