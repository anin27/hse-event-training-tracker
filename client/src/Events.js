import React, { useState, useEffect } from 'react';
import API from './api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    location: '',
    capacity: '',
  });

  useEffect(() => {
    const role = localStorage.getItem('role') || 'employee';
    setUserRole(role);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      setEvents(res.data);
    } catch (err) {
      setError('Error fetching events');
      console.error(err);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location || !formData.capacity) {
      setError('All fields required');
      return;
    }

    try {
      await API.post('/events', formData);
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        location: '',
        capacity: '',
      });
      setShowCreateForm(false);
      setError('');
      fetchEvents();
    } catch (err) {
      setError('Error creating event');
      console.error(err);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location || !formData.capacity) {
      setError('All fields required');
      return;
    }

    try {
      await API.put(`/events/${editingId}`, formData);
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        location: '',
        capacity: '',
      });
      setEditingId(null);
      setError('');
      fetchEvents();
    } catch (err) {
      setError('Error updating event');
      console.error(err);
    }
  };

  const handleEditEvent = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date.split('T')[0],
      location: event.location,
      capacity: event.capacity,
    });
    setEditingId(event._id);
    setShowCreateForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await API.delete(`/events/${eventId}`);
        fetchEvents();
      } catch (err) {
        setError('Error deleting event');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      date: '',
      location: '',
      capacity: '',
    });
    setError('');
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Training Events</h2>
        {userRole === 'manager' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-create-event"
          >
            {showCreateForm ? 'Cancel' : '+ Create Event'}
          </button>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showCreateForm && (
        <div className="event-form-section">
          <h3>{editingId ? 'Edit Event' : 'Create New Event'}</h3>
          <form onSubmit={editingId ? handleUpdateEvent : handleCreateEvent}>
            <div className="form-group">
              <label>Event Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter event description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Safety, Health, Training"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="Enter event capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : events.length > 0 ? (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Capacity:</strong> {event.capacity}</p>
              {event.description && <p><strong>Description:</strong> {event.description}</p>}

              <div className="event-actions">
                {(userRole === 'manager' || userRole === 'employee') && (
                  <button className="btn-register">Register</button>
                )}

                {userRole === 'admin' && (
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                )}

                {userRole === 'manager' && (
                  <>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
}