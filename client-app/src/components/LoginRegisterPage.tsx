import React, { useState } from 'react';
import { FaFacebook, FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';

import { Button, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/loginRegister.css'

const LoginRegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate(); // Moved useNavigate to the top level of the component
  
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('http://localhost:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token); // Save token
        navigate('/home');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(data.detail || 'Failed to Login.');
        console.error('Login failed:', data.detail);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, email, password, name })
      });

      const data = await response.json();
      if (response.ok) {
        setActiveTab('login');
      } else {
        console.error('Registration failed:', data.detail);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  return (
    <div className="login-register-container">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          LOGIN
        </button>
        <button
          className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          REGISTER
        </button>
      </div>
      {/* Snackbar for feedback */}
      <Snackbar open={!!snackbarMessage} autoHideDuration={8000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {activeTab === 'login' ? 
        <LoginForm setActiveTab={setActiveTab} onSubmit={handleLoginSubmit}/> : 
        <RegisterForm setActiveTab={setActiveTab} onSubmit={handleRegisterSubmit}/>
      }
    </div>
  );
};

interface FormProps {
  setActiveTab: (tab: 'login' | 'register') => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const LoginForm: React.FC<FormProps> = ({ setActiveTab, onSubmit }) => {
    return (
      <form className="login-form" onSubmit={onSubmit}>
        <input name="username" type="text" placeholder="Email or username" />
        <input name="password" type="password" placeholder="Password" />
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="/forgotpasswordpage" className="forgot-password">Forgot password?</a>
        </div>
        <button type="submit" className="submit-button">SIGN IN</button>
        <p className="switch-form-link">
          Not a member? <a onClick={() => setActiveTab('register')}>Register</a>
        </p>
      </form>
    );
  };

const RegisterForm: React.FC<FormProps> = ({ setActiveTab, onSubmit }) => {
  return (
    <form className="register-form" onSubmit={onSubmit}>
      <input name="name" type="text" placeholder="Name" />
      <input name="username" type="text" placeholder="Username" />
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <input name="passwordRepeat" type="password" placeholder="Repeat password" />
      <div className="form-options">
        <label className="terms-agreement">
          <input type="checkbox" />
          <span>I agree to the terms and conditions</span>
        </label>
      </div>
      <button type="submit" className="submit-button">REGISTER</button>
      <p className="switch-form-link">
        Already a member? <a onClick={() => setActiveTab('login')}>Login</a>
      </p>
    </form>
  );
};

export default LoginRegisterPage;