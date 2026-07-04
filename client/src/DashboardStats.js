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
  }, []);

  const fetchStats = async () => {
    try {
      const eventsRes = await API.get('/events');
      const events = eventsRes.data;

      const today = new Date();
      const upcoming = events.filter(e => new Date(e.date) > today).length;

      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        totalRegistrations: 0,
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