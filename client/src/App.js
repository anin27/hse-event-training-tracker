import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [isAuth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <div className="App">
      {!isAuth ? <Login setAuth={setAuth} /> : <Dashboard />}
    </div>
  );
}

export default App;