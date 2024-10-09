import React, { useState } from 'react';
import { FaFacebook, FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/loginRegister.css'

const LoginRegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

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

      {activeTab === 'login' ? 
        <LoginForm setActiveTab={setActiveTab} /> : 
        <RegisterForm setActiveTab={setActiveTab} />
      }
    </div>
  );
};

interface FormProps {
  setActiveTab: (tab: 'login' | 'register') => void;
}

const LoginForm: React.FC<FormProps> = ({ setActiveTab }) => {
    const navigate = useNavigate(); // Initialize useNavigate
  
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Perform login logic here (e.g., API call to authenticate)
      
      // After successful login, redirect to /home
      navigate('/home');
    };
  
    return (
      <form className="login-form" onSubmit={handleLoginSubmit}>
        {/* <h2>Sign in</h2> */}
        {/* <div className="social-buttons">
          <button type="button" className="social-button"><FaFacebook /></button>
          <button type="button" className="social-button"><FaGoogle /></button>
          <button type="button" className="social-button"><FaTwitter /></button>
          <button type="button" className="social-button"><FaGithub /></button>
        </div>
        <p className="or-divider">or:</p> */}
        <input type="text" placeholder="Email or username" />
        <input type="password" placeholder="Password" />
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

const RegisterForm: React.FC<FormProps> = ({ setActiveTab }) => {
  return (
    <form className="register-form">
      {/* <h2>Sign up</h2> */}
      {/* <div className="social-buttons">
        <button type="button" className="social-button"><FaFacebook /></button>
        <button type="button" className="social-button"><FaGoogle /></button>
        <button type="button" className="social-button"><FaTwitter /></button>
        <button type="button" className="social-button"><FaGithub /></button>
      </div> */}
      {/* <p className="or-divider">or:</p> */}
      <input type="text" placeholder="Name" />
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Repeat password" />
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