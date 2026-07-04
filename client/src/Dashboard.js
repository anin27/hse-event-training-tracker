import React, { useState, useEffect } from 'react';
import API from './api';
import DashboardStats from './DashboardStats';

export default function Dashboard({ setCurrentPage, userRole }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await API.get('/events');
      setEvents(eventsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
    setLoading(false);
  };

  const handleEditEvent = (eventId) => {
    localStorage.setItem('editEventId', eventId);
    setCurrentPage('events');
  };

  return (
    <div>
      <DashboardStats />

      <div className="dashboard-container">
        <div className="dashboard-content">
          <h2>Dashboard</h2>

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
                    {userRole === 'admin' && <th>Action</th>}
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
                      {userRole === 'admin' && (
                        <td>
                          <button 
                            className="btn-edit-small"
                            onClick={() => handleEditEvent(event._id)}
                          >
                            Edit
                          </button>
                        </td>
                      )}
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
    </div>
  );
}