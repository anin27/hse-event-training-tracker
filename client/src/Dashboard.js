import React, { useState, useEffect } from 'react';
import API from './api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    completedEvents: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  return (
    <div className="dashboard-container">
      <div>Dashboard Placeholder</div>
    </div>
  );
}
