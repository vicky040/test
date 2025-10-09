import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import axios from "axios";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [deposits, setDeposits] = useState([]);
  const [error, setError] = useState('');

  const [telegramLink, setTelegramLink] = useState("");

  // Mock data
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const [cryptoPrices, setCryptoPrices] = useState([
    { symbol: 'BTC/USDT', sym: 'BTC', price: 118475.67, change: -0.08, volume: '2.5B' },
    { symbol: 'ETH/USDT', sym: 'ETH', price: 3404.69, change: -0.19, volume: '1.8B' },
    { symbol: 'DOGE/USDT', sym: 'DOGE', price: 0.212604, change: -0.05, volume: '850M' },
    { symbol: 'EOS/USDT', sym: 'EOS', price: 0.7213, change: 0.00, volume: '120M' },
    { symbol: 'RUPEE/USDT', sym: 'RPE', price: 0.7213, change: 0.00, volume: '120M' }
  ]);

  const [allTransactions] = useState([
    
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'All Users', icon: '👥' },
    { id: 'prices', label: 'Price Control', icon: '💰' },
    { id: 'transactions', label: 'Transactions', icon: '📋'}
  ];

  const totalUsers = users?.length;
  const activeUsers = users?.filter(user => user.status === 'active').length;
  const totalBalance = users?.reduce((sum, user) => sum + user.balance, 0);
  const totalDeposits = users?.reduce((sum, user) => sum + user.deposit, 0);

  const BaseUrl = 'https://crypto-bac.onrender.com';

useEffect(() => {
    axios
      .get(`${BaseUrl}/api/v1/admin/users`, { withCredentials: true })
      .then((res) => {
        setUsers(res.data); // <-- backend sends array directly
      })
      .catch((err) => console.error(err));
}, []);

const fetchUserById = async (userId) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get(`${BaseUrl}/api/v1/admin/users/${userId}`, {
        withCredentials: true,
      });
      setUser(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to fetch user');
    } finally {
      setLoading(false);
      setSelectedUser(user);
      setShowUserModal(true);
    }
};

const fetchTransactions = async () => {
    try {
      console.log("Hello");
      
      setLoadingTx(true);
      const res = await axios.get(`${BaseUrl}/api/v1/admin/transactions`, { withCredentials: true });
      console.log(res.data);
      setTransactions(res.data.transactions);
      setLoadingTx(false);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setLoadingTx(false);
    }
};

useEffect(() => {
  axios
    .get(`${BaseUrl}/api/v1/admin/crypto`, { withCredentials: true })
    .then((res) => {
      // Transform backend data to match frontend format
      const formatted = res.data.map(c => ({
        symbol: `${c.symbol}/USDT`,
        sym: c.symbol,
        price: c.price,
        change: c.change || 0,
        volume: c.volume || 'N/A'
      }));
      setCryptoPrices(formatted);
    })
    .catch((err) => console.error(err));
}, []);

const handleUpdateUserBalance = (userId, addAmount) => {
  // Ensure addAmount is a number
  const amountToAdd = parseFloat(addAmount);

  axios
    .put(`${BaseUrl}/api/v1/admin/users/${userId}/balance`, { addAmount: amountToAdd }, { withCredentials: true })
    .then((res) => {
      // Update the users list state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, balance: (u.balance || 0) + amountToAdd } // add to existing balance
            : u
        )
      );

      // Update the selected user state
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({
          ...prev,
          balance: (prev.balance || 0) + amountToAdd,
        }));
      }
    })
    .catch(err => console.error(err));
};

const handleUpdatePrice = (symbol, newPrice) => {
    axios
      .put(`${BaseUrl}/api/v1/admin/crypto/${symbol}`, { newPrice }, { withCredentials: true })
      .then((res) => {
        setCryptoPrices((prev) =>
          prev.map((c) =>
            c.sym === symbol ? { ...c, price: parseFloat(newPrice) } : c
          )
        );
      })
      .catch(err => console.error(err));
};

const handleLogout = () => {
    axios
      .post(`${BaseUrl}/api/v1/auth/logout`, {}, { withCredentials: true })
      .then(() => (window.location.href = "/login"))
      .catch((err) => console.error(err));
};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("qr", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${BaseUrl}/api/v1/admin/uploadqr`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("QR Code uploaded successfully!");
      setFile(null);
      setPreview(null);

      console.log(res.data.qrUrl); // You can save this URL if needed
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeposits = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${BaseUrl}/api/v1/admin/depositReq`, { withCredentials: true });
      setDeposits(res.data.data);
      console.log(res.data.data);
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch deposits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);
  
  // Update deposit status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BaseUrl}/api/v1/admin/deposits/${id}`,
        { status },
        { withCredentials: true }
      );
      // Refresh list after update
      fetchDeposits();
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
    }
  };

  useEffect(() => {
    axios
      .get(`${BaseUrl}/api/v1/settings/telegram`, { withCredentials: true })
      .then((res) => setTelegramLink(res.data.telegramLink || ""))
      .catch((err) => console.error(err));
  }, []);

  
  const handleSave = async () => {

    setLoading(true);
    try {
      const res = await axios.put(
        `${BaseUrl}/api/v1/settings/telegram`,
        { telegramLink },
        { withCredentials: true }
      );
      setMessage("✅ Telegram link updated successfully!");
      console.log(res);
      
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update Telegram link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <span className="admin-name">Administrator</span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {setActiveTab(tab.id); tab.id == "transactions" && fetchTransactions()}}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="admin-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-value">{activeUsers}</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-value">{totalBalance?.toFixed(2)} USDT</div>
                    <div className="stat-label">Total Balance</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <div className="stat-value">{totalDeposits?.toFixed(2)} USDT</div>
                    <div className="stat-label">Total Deposits</div>
                  </div>
                </div>
              </div>

              <div className="telegram-container">
                <h2 className="telegram-title">Telegram Link</h2>

                <div className="telegram-input-container">
                  <input
                    type="text"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    autocomplete="off" 
                    placeholder="https://t.me/YourChannel"
                    className="telegram-input"
                  />
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`telegram-button ${loading ? "disabled" : ""}`}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>

              </div>

              <div className="recent-activity">
                <h3 className="section-title">Recent Activity</h3>
                <div className="activity-list">
                  {allTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="activity-item">
                      <div className="activity-icon">
                        {transaction.type === 'deposit' ? '💳' : '💸'}
                      </div>
                      <div className="activity-details">
                        <div className="activity-text">
                          {transaction.username} {transaction.type}ed {transaction.amount} USDT
                        </div>
                        <div className="activity-date">{transaction.date}</div>
                      </div>
                      <div className={`activity-status ${transaction.status}`}>
                        {transaction.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <h3 className="section-title">All Users</h3>
              <div className="users-table">
                <div className="table-header">
                  <div className="header-cell">User</div>
                  <div className="header-cell">Balance</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Actions</div>
                </div>
                {users?.map((user) => (
                  <div key={user.id} className="table-row">
                    <div className="user-cell">
                      <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                      <div className="user-info">
                        <div className="user-name">{user.username}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="balance-cell">
                      <div className="balance-amount">{user?.balance?.toFixed(2)} USDT</div>
                      <div className="deposit-amount">{user.usdt?.toFixed(2)} USDT</div>
                    </div>
                    <div className="status-cell">
                      <span className={`status-badge ${user.status}`}>{user.status}</span>
                    </div>
                    <div className="actions-cell">
                      <button 
                        className="action-btn-admin view-btn"
                        onClick={() => fetchUserById(user._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Control Tab */}
          {activeTab === 'prices' && (
            <div className="prices-section">
              <h3 className="section-title">Cryptocurrency Price Control</h3>
              <div className="prices-grid">
                {cryptoPrices.map((crypto) => (<>
                  <div key={crypto.symbol} className="price-card-admin" style={crypto.symbol === "RPE" ? { gridArea: "3/1/4/2" } : {}}>
                    <div className="price-header">
                      <div className="crypto-symbol">{crypto.symbol}</div>
                      <div className={`price-change ${crypto.change >= 0 ? 'positive' : 'negative'}`}>
                        {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                      </div>
                    </div>
                    <div className="price-current">${crypto.price.toLocaleString()}</div>
                    <div className="price-volume">Volume: {crypto.volume}</div>
                    <div className="price-controls">
                      <input
                        type="number"
                        placeholder="New Price"
                        className="price-input"
                        step="0.01"
                        autoComplete='off'

                      />
                      <button 
                        className="update-btn"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          if (input.value) {
                            handleUpdatePrice(crypto.sym, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div className="upload-container">
                  <h2>Upload QR Code</h2>

                  {/* Image preview */}
                  {preview ? (
                    <div className="image-preview">
                      <img src={preview} alt="QR Preview" />
                    </div>
                  ) : (
                    <div className="image-placeholder">QR Code Preview</div>
                  )}

                  {/* File input */}
                  <label htmlFor="file-upload" className="custom-file-upload">
                    Select QR Image
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    autoComplete='off'
                    style={{ display: "none" }}
                  />

                  <button className="upload-btn" onClick={handleUpload} disabled={loading}>
                    {loading ? "Uploading..." : "Upload QR Code"}
                  </button>

                  {message && <div className="upload-message">{message}</div>}
                </div></>
                ))}
                
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="transactions-section">
              <h3 className="section-title">All Transactions</h3>
              <div className="transactions-table">
                <div className="table-header">
                  <div className="header-cell">User</div>
                  <div className="header-cell">Amount</div>
                  <div className="header-cell">Type</div>
                  <div className="header-cell">Date</div>
                  <div className="header-cell">Status</div>
                </div>
                {deposits.map((transaction) => (
                  <div key={transaction.id} className="transaction-bar">
                  {/* User Info */}
                  <div className="user-info">
                    <div className="user-avatar">{transaction.userId.username[0].toUpperCase()}</div>
                    <div className="user-name">{transaction.userId.username}</div>
                  </div>

                  {/* Amount */}
                  <div className={`amount ${transaction.type === 'deposit' ? 'positive' : 'negative'}`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} USDT
                  </div>

                  {/* Type */}
                  <div className="transaction-type">
                    {transaction.type === 'deposit' ? '💳 Deposit' : '💸 Withdraw'}
                  </div>

                  {/* Date & Time */}
                  <div className="transaction-date">{transaction.createdAt.slice(0,10)} : {transaction.createdAt.slice(12,19)}</div>

                  {/* Accept / Decline Buttons */}
                  <div className="actions">
                    <button
                      className="accept-btn"
                      onClick={() => updateStatus(transaction._id, 'approved')}
                    >
                      Accept
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() => updateStatus(transaction._id, 'rejected')}
                    >
                      Decline
                    </button>
                  </div>

                  {/* View More */}
                  <div className="view-more">
                    <button onClick={() => fetchUserById(transaction.userId._id)}>
                      View More
                    </button>
                  </div>
                </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">User Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUserModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-profile">
                <div className="profile-avatar">{selectedUser.username[0].toUpperCase()}</div>
                <div className="profile-info">
                  <h4 className="profile-name">{selectedUser.username}</h4>
                  <p className="profile-type">{selectedUser.userType}</p>
                </div>
              </div>

              <div className="user-details-grid">
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedUser.mobile}</span>
                </div>
                <div className="detail-item">
                  <label>Join Date:</label>
                  <span>{selectedUser.createdAt.slice(0, 10)}</span>
                </div>
                <div className="detail-item">
                  <label>Last Login:</label>
                  <span>{selectedUser.lastLogin}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
                </div>
              </div>

              <div className="balance-controls">
                <div className="balance-item">
                  <label>Current Balance : {user.usdt}</label>
                  <div className="balance-control">
                    <span className="balance-value">{selectedUser.balance?.toFixed(2)} USDT</span>
                    <input
                        autoComplete='off'

                      type="number"
                      placeholder="Add Balance"
                      className="balance-input"
                      step="0.01"
                    />
                    <button 
                      className="update-balance-btn"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value) {
                          handleUpdateUserBalance(selectedUser._id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="balance-item">
                  <label>Total Deposit:</label>
                  <span className="deposit-value">{selectedUser?.deposit?.toFixed(2)} USDT</span>
                </div>
              </div>

              <div className="user-transactions">
                <h4 className="transactions-title">Transaction History</h4>
                <div className="transactions-list">
                  {user?.transactions?.length > 0 ? (
                    user.transactions.map((transaction) => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="transaction-icon">
                          {transaction.type === 'deposit' ? '💳' : '💸'}
                        </div>
                        <div className="transaction-details">
                          <div className="transaction-type">{transaction.type}</div>
                          <div className="transaction-date">{transaction.date}</div>
                        </div>
                        <div className="transaction-amount">
                          <span className={transaction.type === 'deposit' ? 'positive' : 'negative'}>
                            {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} USDT
                          </span>
                        </div>
                        <div className={`transaction-status ${transaction.status}`}>
                          {transaction.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-transactions">No transactions found</div>
                  )
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;