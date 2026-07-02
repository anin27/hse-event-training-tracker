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
          {/* Navbar coming next */}
        </div>
      )}
    </div>
  );