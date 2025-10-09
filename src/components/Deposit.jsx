import React, { useState, useEffect } from 'react';
import './Deposit.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Deposit({currStep}) {
  const BaseUrl = "https://crypto-bac.onrender.com";

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const { selectedAmount: initialAmount, startStep } = location.state || {};

  // Step control
  const [step, setStep] = useState(startStep || 1); // 1: select amount, 2: show QR
  const [selectedAmount, setSelectedAmount] = useState(initialAmount || '');
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const [usdtVal, setusdtVal] = useState(0);

  // Fetch QR Code only when Step 2 begins
  useEffect(() => {
    if (step === 2) {
      const fetchQRCode = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${BaseUrl}/api/v1/user/qr`, {
            withCredentials: true,
          });
          setQrCodeUrl(res.data.data);
        } catch (err) {
          console.error(err.response?.data || err.message);
          setError("Failed to load QR code");
        } finally {
          setLoading(false);
        }
      };
      fetchQRCode();
      setTimer(300); // reset timer when QR shows
    }
  }, [step]);

  // Countdown timer logic
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      // Hide QR when time runs out
      setQrCodeUrl(null);
    }
  }, [step, timer]);

  // Format timer mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle back from Step 2
  const handleBack = () => {
    setStep(1);
    setQrCodeUrl(null);
    setTimer(300);
  };

    const createDeposit = async () => {
    if (!selectedAmount) {
      setMessage('Please select an amount');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        `${BaseUrl}/api/v1/user/createDeposit`,
        { selectedAmount },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage('Deposit request created successfully!');
        setSelectedAmount(''); // reset selection if needed
      } else {
        setMessage(res.data.message || 'Failed to create deposit');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage('Server error while creating deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
  if (!selectedAmount) return;

  setLoading(true);
  try {
    // fetch price first
    const res = await axios.get(`${BaseUrl}/api/v1/user/cryptos`, { withCredentials: true });
    const rpe = res.data.find(c => c.name === "RPE");
    if (!rpe) {
      setMessage("RPE price not found");
      return;
    }
    const price = Number(rpe.price);
    setusdtVal(price);

    // create deposit
    const depositRes = await axios.post(
      `${BaseUrl}/api/v1/user/createDeposit`,
      { selectedAmount },
      { withCredentials: true }
    );

    if (!depositRes.data.success) {
      setMessage(depositRes.data.message || "Deposit failed");
      return;
    }

    // Now safely move to Step 2
    setStep(2);
  } catch (err) {
    console.error(err.response?.data || err.message);
    setMessage("Server error");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="deposit-page">
      <div className="deposit-container">
        {/* Header */}
        <header className="deposit-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="deposit-title">Deposit</h1>
          <button className="record-btn" onClick={() => {navigate('/coming-soon')}}>Record</button>
        </header>

        
        {step === 1 && (
          <div className="deposit-section">
            <h2>Select Amount</h2>
            <p>Choose how much USDT you want to buy:</p>
            <select
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              className="usdt-dropdown"
            >
              <option value="">Select Amount</option>
              <option value="10">10 USDT</option>
              <option value="20">20 USDT</option>
              <option value="50">50 USDT</option>
              <option value="100">100 USDT</option>
              <option value="200">200 USDT</option>
              <option value="500">500 USDT</option>
              <option value="1000">1000 USDT</option>
            </select>
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={!selectedAmount}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 – QR Code */}
        {step === 2 && (
          <div className="deposit-section">
            <h2>Deposit USDT</h2>
            <p>Pay <strong>{usdtVal ? Number(selectedAmount) * usdtVal : "...loading"} to the QR Code</strong></p>
            
            {/* Back button to go back to amount selection */}
            <button className="back-to-selection-btn" onClick={handleBack}>
              ← Back to Selection
            </button>

            {loading && <p>Loading QR Code...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {qrCodeUrl ? (
              <>
                <img
                  src={qrCodeUrl}
                  alt="Deposit QR Code"
                  className="deposit-qr"
                  style={{
                    width: "250px",
                    height: "250px",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    objectFit: "cover",
                  }}
                />
                <p className="timer-text">QR expires in: {formatTime(timer)}</p>
              </>
            ) : (
              <p>QR code expired or unavailable</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Deposit;
