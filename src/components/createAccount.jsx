import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createAccount.css';

function CreateAccount() {
  const [currentStep, setCurrentStep] = useState('register'); // 'register' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    verification: ''
  });

  const navigate = useNavigate();

  const BaseUrl = 'https://precious-cynthy-cryptoo-083d74eb.koyeb.app/'

  // ===== Handle Input =====
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ===== OTP Input =====
  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  // ===== Timer Effect for OTP =====
  useEffect(() => {
    if (currentStep === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [currentStep, timer]);

  // ===== Registration Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.username &&
      formData.email &&
      formData.phone &&
      formData.password &&
      formData.password === formData.confirmPassword
    ) {
      try {
        setLoading(true);
        // call backend to send OTP
        await axios.post(`${BaseUrl}/api/v1/auth/requestOTP`, {
          email: formData.email,
          mobile: formData.phone,
          username: formData.username,
          password: formData.password,
        }, { withCredentials: true });
        console.log("SIgning up")
        // Switch to OTP screen
        setCurrentStep('otp');
        setTimer(60);
        setCanResend(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || 'Error sending OTP');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill all fields and make sure passwords match');
    }
  };

  // ===== Verify OTP =====
  const handleOTPVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      try {
        setLoading(true);
        const res = await axios.post(`${BaseUrl}/api/v1/auth/addUser`, {
          email: formData.email,
          otp: otpCode,
          username: formData.username,
          password: formData.password,
          mobile: formData.phone,
        }, { withCredentials: true });

        alert('Account created successfully!');
        console.log('User created:', res.data.user);
        navigate('/login');
        // redirect to dashboard or login page
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert(err.response?.data?.message || 'OTP verification failed');
      } finally {
        setLoading(false);
      }
    }
  };

  // ===== Resend OTP =====
  const handleResendOTP = async () => {
    if (canResend) {
      try {
        await axios.post(`${BaseUrl}/api/v1/auth/requestOTP`, {
          email: formData.email,
          mobile: formData.phone,
          username: formData.username,
          password: formData.password,
        }, { withCredentials: true });
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.querySelector('input[name="otp-0"]');
        if (firstInput) firstInput.focus();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to resend OTP');
      }
    }
  };

  const handleBackToRegister = () => {
    setCurrentStep('register');
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
  };

  const isOTPComplete = otp.every(digit => digit !== '');

  // OTP Verification Screen
  if (currentStep === 'otp') {
    return (
      <div className="create-account-page">
        <div className="create-account-container">

          {/* OTP Title */}
          <h1 className="create-account-title">Email Verification</h1>

          {/* Email Info */}
          <div className="email-info">
            <p className="verification-text">
              We've sent a 6-digit verification code to
            </p>
            <p className="email-address">{formData.email || 'your email address'}</p>
          </div>

          {/* OTP Input */}
          <div className="otp-input-section">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                        autoComplete='off'

                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="otp-digit"
                  maxLength="1"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="timer-section">
            {!canResend ? (
              <p className="timer-text">
                Resend code in <span className="timer-count">{timer}s</span>
              </p>
            ) : (
              <button className="resend-btn" onClick={handleResendOTP}>
                Resend Code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button 
            className={`register-btn ${isOTPComplete ? 'active' : ''}`}
            onClick={handleOTPVerify}
            disabled={!isOTPComplete}
          >
            Verify
          </button>

          {/* Help Text */}
          <div className="help-section">
            <p className="help-text">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
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

  // Registration Form Screen
  return (
    <div className="create-account-page">
      <div className="create-account-container">

        {/* Create Account Title */}
        <h1 className="create-account-title">Create Account</h1>

        {/* Registration Form */}
        <form className="create-account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
                        autoComplete='off'

              type="text"
              name="username"
              placeholder="Please Enter Username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
                        autoComplete='off'

              type="email"
              name="email"
              placeholder="Please Enter Email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="phone-input-wrapper">
              <select className="country-code">
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+86">+86</option>
              </select>
              <input
                type="tel"
                name="phone"
                        autoComplete='off'

                placeholder="Please Enter Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input phone-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Please Enter Password"
                value={formData.password}
                        autoComplete='off'

                onChange={handleInputChange}
                className="form-input"
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

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Please Confirm Password Again"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                        autoComplete='off'
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showConfirmPassword ? (
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

          <button type="submit" className="register-btn" onClick={(e) => {handleSubmit(e)}}>Register</button>

          <div className="login-link">
            <span className="have-account">Already Have an Account?</span>
            <button type="button" className="login-account-link" onClick={() => {navigate('/')}}>Login</button>
          </div>
        </form>
      </div>

      {/* Service Widget */}
      <div className="service-widget">
        <div className="service-icon">💬</div>
        <span className="service-text">Service</span>
      </div>
    </div>
  );
}

export default CreateAccount;