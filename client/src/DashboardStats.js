import React, { useState, useEffect } from 'react';
import API from './api';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
  });

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const eventsRes = await API.get('/events');
      const events = eventsRes.data;

      const enrollmentsRes = await API.get('/enrolments');
      const enrollments = enrollmentsRes.data;

      const today = new Date();
      const upcoming = events.filter(e => new Date(e.date) > today).length;

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        totalRegistrations: enrollments.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Events</div>
        <div className="stat-value">{stats.totalEvents}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Upcoming Events</div>
        <div className="stat-value">{stats.upcomingEvents}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Total Registrations</div>
        <div className="stat-value">{stats.totalRegistrations}</div>
      </div>
    </div>
  );
}