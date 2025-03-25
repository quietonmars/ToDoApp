import React, { useState } from 'react';
import { register } from '../api/auth';  // Only import register
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Registration failed - username may be taken');
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <h2>Registration Successful!</h2>
        <p>You can now login with your credentials.</p>
        <Link to="/login" className="auth-link">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <Link to="/login" className="toggle-auth">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default RegisterPage;