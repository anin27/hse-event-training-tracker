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