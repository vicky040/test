import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyAccount.css";
import { useNavigate } from "react-router-dom";

function MyAccount() {

  const navigate = useNavigate();

  const BaseUrl = 'https://precious-cynthy-cryptoo-083d74eb.koyeb.app/';

  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', address: '/home' },
        { id: 'trade', label: 'Trade', icon: '📈', address: '/trade' },
        { id: 'transfer', label: 'Transfer', icon: '🔄', address: '/coming-soon' },
        { id: 'account', label: 'My Account', icon: '👤', address: '/my-account' },
  ];

  const menuItems = [
    { id: "notifications", icon: "🔔", label: "Message Notification", hasArrow: true, address: "/coming-soon" },
    { id: "quickbuy", icon: "💰", label: "Quick Buy", hasArrow: true, address: "/coming-soon" },
    { id: "help", icon: "❓", label: "Help Center", hasArrow: true, address: "/coming-soon" },
    { id: "language", icon: "💬", label: "Language Switch", hasArrow: true, address: "/coming-soon" },
  ];

  const buttons = [
    { id: 'deposit', label: 'Deposit', icon: '💳', address: "/deposit"},
    { id: 'withdraw', label: 'Withdraw', icon: '⏸️', address: "/withdraw" },
    { id: 'transfer', label: 'Internal Transfer', icon: '📊', address: "/coming-soon" },
    { id: 'upgrade', label: 'Membership Upgrade', icon: '💎', address: "/membership" },
  ];

  // Fetch account details on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/v1/user/me`, { withCredentials: true });
        setUserData(res.data);
        console.log(res);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BaseUrl}/api/v1/auth/logout`, {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  

  if (loading) return <div>Loading account...</div>;

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Header */}
        <header className="account-header">
          <h1 className="account-title">My Account</h1>
          <button className="settings-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="m12 1 1.09 3.26L16 5l-1.74 2.74L17 10l-3.26 1.09L12 14l-1.09-3.26L8 10l1.74-2.74L7 5l3.26-1.09L12 1z"/>
            </svg>
          </button>
        </header>

        {/* User Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-info">
              <div className="avatar">
                <span className="avatar-text">M</span>
              </div>
              <div className="user-details">
                <div className="username">{userData.username}</div>
                <div className="user-type">{userData.currentPlan}</div>
              </div>
            </div>
          </div>
          
          <div className="balance-section">
            <div className="balance-item">
              <div className="balance-label">My Assets (USDT)</div>
              <div className="balance-value">{userData.usdt}</div>
            </div>
            <div className="balance-item">
              <div className="balance-label">Deposit (USDT)</div>
              <div className="balance-value">0</div>
              <button className="refund-btn">Apply for Refund</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
            {buttons.map((button) => (
                <button key={button.id} className="action-btn" onClick={() => {navigate(button?.address)}}>
                <span className="action-icon">{button.icon}</span>
                <span className="action-label">{button.label}</span>
                </button>
            ))}
        </div>

        {/* Menu Items */}
        <div className="menu-section">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item" onClick={() => {navigate(item.address)}}>
              <div className="menu-left">
                <div className="menu-icon">{item.icon}</div>
                <span className="menu-label">{item.label}</span>
              </div>
              {item.hasArrow && (
                <svg className="menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              )}
            </div>
          ))}
        </div>
        
        {/* Switch Account Button */}
        <button className="switch-account-btn" onClick={() => {handleLogout()}}>Switch to another account</button>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {setActiveTab(item.id); navigate(item.address)}}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Service Widget */}
      <div className="service-widget">
        <div className="service-icon">💬</div>
        <span className="service-text">Service</span>
      </div>
    </div>
  );
}

export default MyAccount;