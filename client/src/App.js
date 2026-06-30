import React, { useState } from 'react';
import './App.css';
import Login from './Login';

function App() {
  const [isAuth, setAuth] = useState(!!localStorage.getItem('token'));

  if (!isAuth) {
    return <Login setAuth={setAuth} />;
  }

  return (
    <div className="app">
      <h1>Welcome!</h1>
      <button onClick={() => {
        localStorage.removeItem('token');
        setAuth(false);
      }}>
        Logout
      </button>
    </div>
  );
}

export default App;