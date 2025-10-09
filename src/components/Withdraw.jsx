import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Withdraw.css';

function Withdraw() {
  
  const [activeTab, setActiveTab] = useState('trade');

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'trade', label: 'Trade', icon: '📈' },
    { id: 'transfer', label: 'Transfer', icon: '🔄' },
    { id: 'account', label: 'My Account', icon: '👤' },
  ];

  const navigate = useNavigate();

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        {/* Header */}
        <header className="withdraw-header">
          <button className="back-btn" onClick={() => {navigate(-1)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="withdraw-title">Withdraw</h1>
          <button className="record-btn">Record</button>
        </header>

        {/* Form Fields */}
        <div className="form-section">

          <div className="form-group">
            <label className="form-label">Account No.</label>
            <div className="form-input-withdraw">
                        
              <input className="input-placeholder" placeholder='Enter Account No.' autoComplete='off' />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">IFCS Code</label>
            <div className="form-input-withdraw">
              <input className="input-placeholder" placeholder='Enter IFCS Code' autoComplete='off'/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <div className="form-input-withdraw">
              <input className="input-placeholder" placeholder='Enter Bank Name' autoComplete='off'/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mobile No.</label>
            <div className="form-input-withdraw">
              <input className="input-placeholder" placeholder='Enter Mobile No' autoComplete='off'/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">UPI Id</label>
            <div className="form-input-withdraw">
              <input className="input-placeholder" placeholder='Enter UPI Id' autoComplete='off'/>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="submit-btn">Submit</button>
      </div>

    </div>
  );
}

export default Withdraw;