import React, { useState } from 'react';
import './MembershipUpgrade.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Deposit from './Deposit';

function MembershipUpgrade() {
  const [activeTab, setActiveTab] = useState('account');
  const [depositWindow, setdepositWindow] = useState(true)

  const membershipTiers = [
    {
      id: 'v1',
      tier: 'V1',
      deposit: '151.00 Rupee',
      amount: 151,
      dailyLimit: '10.00 USDT',
      monthlyLimit: '50.00 USDT',
      color: 'blue',
      isHot: false
    },
    {
      id: 'v2',
      tier: 'V2',
      deposit: '249 Rupee',
      amount: 249,
      dailyLimit: '100.00 USDT',
      monthlyLimit: '3000.00 USDT',
      color: 'green',
      isHot: false
    },
    {
      id: 'v3',
      tier: 'V3',
      deposit: '1049.00 Rupee',
      amount: 1049,
      dailyLimit: '30000.00 USDT',
      monthlyLimit: '900000.00 USDT',
      color: 'red',
      isHot: true
    },
    {
      id: 'v4',
      tier: 'V4',
      deposit: '2049 Rupee',
      amount: 2049,
      dailyLimit: '100000.00 USDT',
      monthlyLimit: '3000000.00 USDT',
      color: 'orange',
      isHot: false
    },
    {
      id: 'v5',
      tier: 'V5',
      deposit: '5000.00 Rupee',
      amount: 5000,
      dailyLimit: '200000.00 USDT',
      monthlyLimit: '6000000.00 USDT',
      color: 'purple',
      isHot: false
    },
    {
      id: 'v6',
      tier: 'V6',
      deposit: '8049 USDT',
      amount: 8049,
      dailyLimit: '2000000.00 USDT',
      monthlyLimit: '60000000.00 USDT',
      color: 'blue',
      isHot: false
    }
  ];

  const BaseUrl = "https://precious-cynthy-cryptoo-083d74eb.koyeb.app/";

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'trade', label: 'Trade', icon: '📈' },
    { id: 'transfer', label: 'Transfer', icon: '🔄' },
    { id: 'account', label: 'My Account', icon: '👤' },
  ];

  const navigate = useNavigate();

  const createDeposit = async (selectedAmount) => {
    if (!selectedAmount) {
      setMessage('Please select an amount');
      return;
    }

    try {
      const res = await axios.post(
        `${BaseUrl}/api/v1/user/createDeposit`,
        { selectedAmount },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };


  return (
    <div className="membership-page">
      <div className="membership-container">
        {/* Header */}
        <header className="membership-header">
          <button className="back-btn" onClick={() => {navigate(-1)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="membership-title">Membership Upgrade</h1>
        </header>

        {/* Membership Tiers */}
        <div className="membership-tiers">
          {membershipTiers.map((tier) => (
            <div key={tier.id} className={`membership-card ${tier.color}`}>
              {tier.isHot && <div className="hot-badge">HOT</div>}
              
              <div className="card-content">
                <div className="tier-info">
                  <div className="tier-number">{tier.tier}</div>
                  <div className="diamond-icon">
                    <div className={`diamond ${tier.color}`}></div>
                  </div>
                </div>
                
                <div className="tier-details">
                  <div className="deposit-amount">Deposit {tier.deposit}</div>
                  <div className="service-text">Collection limit for money transfer service</div>
                  <div className="limits">
                    <div className="limit-item">Daily Collection Limit {tier.dailyLimit}</div>
                    <div className="limit-item">Monthly Collection Limit {tier.monthlyLimit}</div>
                  </div>
                </div>
              </div>
              
              <button className="purchase-btn" onClick={() => {createDeposit(tier.amount); navigate('/deposit', { state: { selectedAmount: tier.amount, startStep: 2 } });}}>Purchase</button>
            </div>
          ))}
        </div>
      </div>


      {/* Service Widget */}
      <div className="service-widget">
        <div className="service-icon">💬</div>
        <span className="service-text">Service</span>
      </div>
    </div>
  );
}

export default MembershipUpgrade;