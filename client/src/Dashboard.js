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

  useEffect(() => {
    const name = localStorage.getItem('name') || 'User';
    const role = localStorage.getItem('role') || 'employee';
    setUserName(name);
    setUserRole(role);

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await API.get('/events');
      const events = eventsRes.data;

      const today = new Date();
      const upcoming = events.filter(e => new Date(e.date) > today).length;

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        totalRegistrations: 0,
        completedEvents: events.filter(e => new Date(e.date) < today).length,
      });

      setEvents(events.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    window.location.reload();
  };