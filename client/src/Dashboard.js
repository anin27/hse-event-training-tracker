import React, { useState, useEffect } from 'react';
import API from './api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    completedEvents: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats.upcomingEvents}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats.totalRegistrations}</div>
            <div className="stat-label">Total Registrations</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats.completedEvents}</div>
            <div className="stat-label">Completed Events</div>
          </div>
        </div>

        <div className="activity-section">
          <h3>Recent Training Events</h3>
          {loading ? (
            <p>Loading...</p>
          ) : events.length > 0 ? (
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{event.category}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.location}</td>
                    <td>{event.capacity}</td>
                    <td>
                      <button className="btn-edit-small">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No events found</p>
          )}
        </div>
      </div>
    </div>
  );
}