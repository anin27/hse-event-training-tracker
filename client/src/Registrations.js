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

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [modalData, setModalData] = useState({
    employeeId: '',
    eventId: '',
    status: 'pending',
  });

  useEffect(() => {
    const role = localStorage.getItem('role') || 'employee';
    setUserRole(role);
    fetchRegistrations();
    if (role === 'manager' || role === 'admin') {
      fetchEventsAndEmployees();
    }
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await API.get('/enrolments');
      setRegistrations(res.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setRegistrations([]);
      if (userRole !== 'employee') {
        setError('Error fetching registrations');
      }
    }
    setLoading(false);
  };

  const fetchEventsAndEmployees = async () => {
    try {
      const eventsRes = await API.get('/events');
      setAllEvents(eventsRes.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
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

  const handleRegisterEmployee = async (e) => {
    e.preventDefault();
    if (!modalData.employeeId || !modalData.eventId) {
      setError('Please select employee and event');
      return;
    }

    try {
      await API.post('/enrolments', {
        employee: modalData.employeeId,
        employeeId: modalData.employeeId,
        event: modalData.eventId,
        status: modalData.status,
      });
      setShowRegisterModal(false);
      setModalData({ employeeId: '', eventId: '', status: 'pending' });
      setError('');
      fetchRegistrations();
    } catch (err) {
      setError('Error registering employee');
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
            <button 
              onClick={() => setShowRegisterModal(true)}
              className="btn-create-event"
            >
              + Register Employee
            </button>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        {showRegisterModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Register Employee for Event</h3>
                <button 
                  onClick={() => setShowRegisterModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleRegisterEmployee}>
                <div className="form-group">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    placeholder="Enter employee name"
                    value={modalData.employeeId}
                    onChange={(e) => setModalData({...modalData, employeeId: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Event</label>
                  <select
                    value={modalData.eventId}
                    onChange={(e) => setModalData({...modalData, eventId: e.target.value})}
                    required
                  >
                    <option value="">-- Select Event --</option>
                    {allEvents.map(event => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={modalData.status}
                    onChange={(e) => setModalData({...modalData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="attended">Attended</option>
                    <option value="completed">Completed</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">Register</button>
                  <button 
                    type="button" 
                    onClick={() => setShowRegisterModal(false)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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