import React, { useState, useEffect } from 'react';
import API from './api';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
  });

  useEffect(() => {
    console.log('DashboardStats mounted');
    fetchStats();
    
    // Refresh stats every 5 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing stats...');
      fetchStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      console.log('=== FETCHING STATS ===');
      console.log('User Role:', sessionStorage.getItem('role'));
      console.log('User Name:', sessionStorage.getItem('name'));
      
      const eventsRes = await API.get('/events');
      console.log('✅ Events API Response Status: SUCCESS');
      console.log('Events data:', eventsRes.data);
      console.log('Total events count:', eventsRes.data?.length);

      const enrollmentsRes = await API.get('/enrolments');
      console.log('✅ Enrolments API Response Status: SUCCESS');
      console.log('Enrolments data:', enrollmentsRes.data);
      console.log('Total enrolments count:', enrollmentsRes.data?.length);

      const events = eventsRes.data || [];
      const enrollments = enrollmentsRes.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('Today date:', today);

      const upcoming = events.filter(e => {
        const eventDate = new Date(e.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate > today;
      }).length;

      console.log('Upcoming events count:', upcoming);
      console.log('Total registrations count:', enrollments.length);

      const newStats = {
        totalEvents: events.length,
        upcomingEvents: upcoming,
        totalRegistrations: enrollments.length,
      };

      console.log('Setting stats:', newStats);
      setStats(newStats);
      console.log('=== STATS FETCHED COMPLETE ===');
    } catch (err) {
      console.error('❌ ERROR fetching stats:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.response?.data?.message);
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