import React, { useState } from 'react';
import API from './api';
import './Login.css';

export default function Login({ setAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  
  // Register fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('employee');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      setAuth(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !regEmail || !regPassword) {
      setError('All fields required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/auth/register', { 
        name, 
        email: regEmail, 
        password: regPassword, 
        role: regRole 
      });
      setError('');
      setName('');
      setRegEmail('');
      setRegPassword('');
      alert('Account created! Now sign in with your email and password.');
      setIsRegister(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {!isRegister ? (
          <>
            <div className="login-logo">
              <h1>HSE Training Tracker</h1>
              <p>Sign in to your account</p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="sign-in-btn">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="role-grid">
              <button
                type="button"
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <span>Admin</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'manager' ? 'active' : ''}`}
                onClick={() => setRole('manager')}
              >
                <span>Manager</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'employee' ? 'active' : ''}`}
                onClick={() => setRole('employee')}
              >
                <span>Employee</span>
              </button>
            </div>

            <button
              type="button"
              className="register-btn"
              onClick={() => setIsRegister(true)}
            >
              Register & Login
            </button>
          </>
        ) : (
          <>
            <div className="login-logo">
              <h1>HSE Training Tracker</h1>
              <p>Create your account</p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="sign-in-btn">
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <button
              type="button"
              className="register-btn"
              onClick={() => setIsRegister(false)}
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}