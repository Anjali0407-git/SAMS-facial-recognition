import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const ForgotPasswordPage = () => {
  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Reset Your Password</h2>
        <form>
          <p>
            <label>Email address</label><br />
            <input type="email" name="email" required />
          </p>
          <p>
            <button className="submit-btn" type="submit">Send Reset Link</button>
          </p>
        </form>
        <footer>
          <p>Remember your password? <Link to="/loginregisterpage">Login</Link></p>
          <p><Link to="/">Back to Homepage</Link></p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;