import React, { useState, useEffect } from 'react';
import API from './api';
import DashboardStats from './DashboardStats';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role') || 'employee';
    setUserRole(role);
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await API.get('/enrolments');
      setRegistrations(res.data);
    } catch (err) {
      setError('Error fetching registrations');
      console.error(err);
    }
    setLoading(false);
  };

  const handleRemoveRegistration = async (enrollmentId) => {
    if (window.confirm('Remove this registration?')) {
      try {
        await API.delete(`/enrolments/${enrollmentId}`);
        fetchRegistrations();
      } catch (err) {
        setError('Error removing registration');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      await API.patch(`/enrolments/${enrollmentId}`, { status: newStatus });
      fetchRegistrations();
    } catch (err) {
      setError('Error updating status');
      console.error(err);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.employee?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <DashboardStats />

      <div className="registrations-container">
        <div className="registrations-header">
          <h2>Employee Registrations</h2>
          {(userRole === 'manager' || userRole === 'admin') && (
            <button className="btn-create-event">+ Register Employee</button>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="registrations-filter">
          <input
            type="text"
            placeholder="Search employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="attended">Attended</option>
            <option value="completed">Completed</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredRegistrations.length > 0 ? (
          <table className="registrations-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Event</th>
                <th>Date Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id}>
                  <td>{reg.employee}</td>
                  <td>{reg.employeeId}</td>
                  <td>{reg.event}</td>
                  <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                  <td>
                    {(userRole === 'manager' || userRole === 'admin') ? (
                      <select
                        value={reg.status}
                        onChange={(e) => handleStatusChange(reg._id, e.target.value)}
                        className={`status-select status-${reg.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="attended">Attended</option>
                        <option value="completed">Completed</option>
                        <option value="no_show">No Show</option>
                      </select>
                    ) : (
                      <span className={`status-badge status-${reg.status}`}>
                        {reg.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {(userRole === 'manager' || userRole === 'admin') && (
                      <button
                        onClick={() => handleRemoveRegistration(reg._id)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No registrations found</p>
        )}
      </div>
    </div>
  );
}