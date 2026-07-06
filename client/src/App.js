import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Events from './Events';
import Registrations from './Registrations';

function App() {
  const [isAuth, setAuth] = useState(!!sessionStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userRole, setUserRole] = useState(sessionStorage.getItem('role') || 'employee');

  useEffect(() => {
    const role = sessionStorage.getItem('role') || 'employee';
    setUserRole(role);
    setCurrentPage('dashboard');
  }, [isAuth]);

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
                {sessionStorage.getItem('name')} ({sessionStorage.getItem('role')})
              </span>
              <button
                onClick={() => {
                  sessionStorage.removeItem('token');
                  sessionStorage.removeItem('name');
                  sessionStorage.removeItem('role');
                  setAuth(false);
                  setUserRole('employee');
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </nav>

          <div className="nav-tabs">
            {userRole === 'admin' && (
              <button
                className={`nav-tab ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </button>
            )}

            {userRole === 'manager' && (
              <>
                <button
                  className={`nav-tab ${currentPage === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('dashboard')}
                >
                  Dashboard
                </button>
                <button
                  className={`nav-tab ${currentPage === 'events' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('events')}
                >
                  Training Events
                </button>
                <button
                  className={`nav-tab ${currentPage === 'registrations' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('registrations')}
                >
                  Registrations
                </button>
              </>
            )}

            {userRole === 'employee' && (
              <>
                <button
                  className={`nav-tab ${currentPage === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('dashboard')}
                >
                  Dashboard
                </button>
                <button
                  className={`nav-tab ${currentPage === 'registrations' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('registrations')}
                >
                  Registrations
                </button>
              </>
            )}
          </div>

          {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} userRole={userRole} />}
          {currentPage === 'events' && <Events />}
          {currentPage === 'registrations' && <Registrations />}
        </div>
      )}
    </div>
  );
}

export default App;