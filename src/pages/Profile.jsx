import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/authStore';
import '../styles/Profile.css';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile">
      <h1>My Profile</h1>

      <div className="profile-container">
        <div className="avatar-section">
          <div className="avatar">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2>{user?.email}</h2>
          <span className="role-badge">{user?.role?.toUpperCase() || 'CUSTOMER'}</span>
        </div>

        <div className="profile-sections">
          <div className="section">
            <h3>Account Information</h3>
            <div className="info-card">
              <span className="icon">👤</span>
              <div>
                <p className="label">Role</p>
                <p className="value">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Customer'}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Preferences</h3>
            <div className="pref-item">
              <span className="icon">🔔</span>
              <span>Notifications</span>
            </div>
            <div className="pref-item">
              <span className="icon">🛡️</span>
              <span>Privacy & Security</span>
            </div>
          </div>

          <div className="section">
            <h3>Support</h3>
            <div className="support-item">
              <span className="icon">❓</span>
              <span>Help & Support</span>
            </div>
            <div className="support-item">
              <span className="icon">📧</span>
              <span>Contact Us</span>
            </div>
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};
