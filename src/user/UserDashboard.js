// src/user/UserDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './styles/UserStyles.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  };

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <h1>User Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main className="user-content">
        <h2>Welcome, User!</h2>
        <p>Here you can view your bookings, manage your profile, and more.</p>
      </main>
    </div>
  );
};

export default UserDashboard;
