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
