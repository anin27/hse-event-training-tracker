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
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [allEvents, setAllEvents] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    eventId: '',
    department: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterEmployee = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.eventId) {
      setError('Please fill all required fields');
      return;
    }

    try {
      await API.post('/enrolments', {
        employee: formData.employeeName,
        employeeId: formData.employeeId,
        event: formData.eventId,
        department: formData.department,
        status: formData.status,
      });
      
      handleClearForm();
      setShowRegisterForm(false);
      setError('');
      fetchRegistrations();
    } catch (err) {
      setError('Error registering employee');
      console.error(err);
    }
  };

  const handleClearForm = () => {
    setFormData({
      employeeName: '',
      employeeId: '',
      eventId: '',
      department: '',
      status: 'pending',
    });
    setError('');
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
        </div>

        {error && <div className="error-msg">{error}</div>}

        {(userRole === 'manager' || userRole === 'admin') && (
          <>
            <button
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              className="btn-register-form"
            >
              + Register Employee
            </button>

            {showRegisterForm && (
              <div className="register-form-section">
                <h3>Register Employee</h3>
                <form onSubmit={handleRegisterEmployee}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Employee Name</label>
                      <input
                        type="text"
                        name="employeeName"
                        placeholder="Enter name"
                        value={formData.employeeName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Employee ID</label>
                      <input
                        type="text"
                        name="employeeId"
                        placeholder="e.g., EMP-001"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Training Event</label>
                      <select
                        name="eventId"
                        value={formData.eventId}
                        onChange={handleInputChange}
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
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        placeholder="e.g., Engineering"
                        value={formData.department}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Attendance Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="attended">Attended</option>
                        <option value="completed">Completed</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit">
                      Register Employee
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClearForm}
                      className="btn-clear"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
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
                  <td>{typeof reg.event === 'object' ? reg.event.title : reg.event}</td>
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