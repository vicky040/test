import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Trade.css';
import { useNavigate } from 'react-router-dom';

function Trade() {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [activeTab, setActiveTab] = useState('trade');
  const [UserData, setUserData] = useState({});

  const periods = [7, 14, 30, 60, 90];

  const navigate = useNavigate();

  const platformRecords = [];

  const BaseUrl = 'http://localhost:3000';

  const navItems = [
        { id: 'home', label: 'Home', icon: '🏠', address: '/home' },
        { id: 'trade', label: 'Trade', icon: '📈', address: '/trade' },
        { id: 'transfer', label: 'Transfer', icon: '🔄', address: '/coming-soon' },
        { id: 'account', label: 'My Account', icon: '👤', address: '/my-account' },
    ];

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/v1/user/me`, { withCredentials: true });
        setUserData(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="trade-page">
      <div className="trade-container">
        {/* Header */}
        <header className="trade-header">
          <h1 className="trade-title">Trade</h1>
        </header>

        {/* User Balance Card */}
        <div className="balance-card">
          <div className="balance-header">
            <div className="user-info">
              <span className="greeting">Hi {UserData?.username}</span>
              <span className="user-type">Ordinary users</span>
            </div>
          </div>
          
          <div className="balance-section">
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">{UserData?.usdt}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn">
            <div className="action-icon">💳</div>
            <span className="action-label">Deposit</span>
          </button>
          <button className="action-btn">
            <div className="action-icon">💸</div>
            <span className="action-label">Withdraw</span>
          </button>
          <button className="action-btn">
            <div className="action-icon">🔄</div>
            <span className="action-label">Internal Transfer</span>
          </button>
          <button className="action-btn">
            <div className="action-icon">💎</div>
            <span className="action-label">Membership Upgrade</span>
          </button>
        </div>

        {/* USDT Section */}
        <div className="usdt-section">
          <div className="usdt-header">
            <div className="usdt-icon">₮</div>
            <span className="usdt-label">USDT</span>
          </div>
        </div>

        {/* Investment Section */}
        <div className="investment-section">
          <div className="investment-header">
            <div className="yield-info">
              <div className="yield-rate">1.00%</div>
              <div className="yield-label">Annual Yield Reference</div>
            </div>
            <div className="period-info">
              <div className="period-value">7Day</div>
              <div className="period-label">Investment Period</div>
            </div>
          </div>

          <div className="period-selector">
            {periods.map((period) => (
              <button
                key={period}
                className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="investment-footer">
            <div className="minimum-investment">
              <div className="minimum-label">Minimum Investment:</div>
              <div className="minimum-value">5000 USDT</div>
            </div>
            <button className="participate-btn">Participate Now</button>
          </div>
        </div>

        {/* Platform Record */}
        <div className="platform-record">
          <div className="record-header">
            <div className="record-icon">📊</div>
            <span className="record-title">Platform Record</span>
          </div>
          
          <div className="record-list">
            {platformRecords.map((record) => (
              <div key={record.id} className="record-item">
                <div className="record-left">
                  <div className="record-type-icon">{record.icon}</div>
                  <div className="record-details">
                    <div className="record-type">
                      {record.type === 'recharge' ? '88***' : record.type}
                    </div>
                    <div className="record-subtype">
                      {record.type === 'recharge' ? 'recharge' : ''}
                    </div>
                  </div>
                </div>
                <div className="record-right">
                  <div className="record-amount">{record.amount} USDT</div>
                  <div className="record-date">{record.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
    </div>
  );
}

export default Trade;