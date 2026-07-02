import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Events from './Events';

function App() {
  const [isAuth, setAuth] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('dashboard');

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

        </div>
      )}
    </div>
  );
}

export default App;