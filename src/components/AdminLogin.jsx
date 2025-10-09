import React, { useState } from 'react';
import './AdminLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const BASE_URL = 'https://crypto-bac.onrender.com'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/admin/login`,
        formData,
        { withCredentials: true } // crucial for cookie        
      );
        console.log(res);

      if (res.data.success) {
        navigate("/admin");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.log(err);
      
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* Header */}
        <header className="admin-login-header">
          <div className="admin-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="m2 17 10 5 10-5"/>
                <path d="m2 12 10 5 10-5"/>
              </svg>
            </div>
            <span className="logo-text">Admin Portal</span>
          </div>
        </header>

        {/* Login Card */}
        <div className="admin-login-card">
          <div className="card-header">
            <div className="admin-avatar">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="admin-login-title">Administrator Login</h1>
            <p className="admin-login-subtitle">Access the admin dashboard</p>
          </div>

          {/* Login Form */}
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter admin username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  required
                        autoComplete='off'

                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                        autoComplete='off'

                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="m15 18-.722-3.25"/>
                        <path d="m2 2 20 20"/>
                        <path d="M6.71 6.71C5.68 7.74 5 9.24 5 12c0 3.5 2.5 7 7 7 2.76 0 4.26-.68 5.29-1.71"/>
                        <path d="m9 9-.84 4.25"/>
                        <path d="M12 5c3.5 0 7 3.5 7 7 0 .84-.16 1.64-.43 2.36"/>
                        <path d="M3 12c0-3.5 2.5-7 7-7 1.17 0 2.26.3 3.21.81"/>
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="admin-login-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" x2="3" y1="12" y2="12"/>
              </svg>
              Access Dashboard
            </button>
          </form>

          {/* Security Notice */}
          <div className="security-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>Secure admin access - All activities are logged</span>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-footer">
          <p>&copy; 2024 Crypto Trading Platform. Admin Portal v2.1</p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="admin-bg-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
    </div>
  );
}

export default AdminLogin;