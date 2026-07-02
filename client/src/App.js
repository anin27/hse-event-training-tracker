import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Events from './Events';

function App() {
  const [isAuth, setAuth] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role') || 'employee';
    setUserRole(role);
  }, []);

  return (
    <div className="App">
      {!isAuth ? (
        <Login setAuth={setAuth} />
      ) : (
        <div>
          <nav className="navbar">
            <div className="navbar-left">
              <h1>HSE Training Tracker</h1>
            </div>
            <div className="navbar-right">
              <span className="user-info">
                {localStorage.getItem('name')} ({localStorage.getItem('role')})
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('name');
                  localStorage.removeItem('role');
                  setAuth(false);
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </nav>

          <div className="nav-tabs">
            <button
              className={`nav-tab ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            {(userRole === 'manager' || userRole === 'employee') && (
              <button
                className={`nav-tab ${currentPage === 'events' ? 'active' : ''}`}
                onClick={() => setCurrentPage('events')}
              >
                Training Events
              </button>
            )}
          </div>

          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'events' && <Events />}
        </div>
      )}
    </div>
  );
}

export default App;