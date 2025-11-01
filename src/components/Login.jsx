import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null); 

  const BaseUrl = 'https://precious-cynthy-cryptoo-083d74eb.koyeb.app/'; 
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BaseUrl}/api/v1/auth/login`, {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      setUserData(res.data.user);
      console.log('Logged in user:', res.data.user);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
      navigate('/home')
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Login Title */}
        <h1 className="login-title">Login</h1>

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Please Enter Email"
              value={formData.email}
              onChange={handleInputChange}
                        autoComplete='off'
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Please Enter Password"
                value={formData.password}
                onChange={handleInputChange}
                        autoComplete='off'
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

          <div className="forgot-password">
            <button type="button" className="forgot-link">Recover Password</button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="signup-link">
            <span className="no-account">No Account? </span>
            <button type="button" className="create-account-link" onClick={() => {navigate('/create-account')}}>Create Account</button>
          </div>
        </form>

        {/* Show user data after login */}
        {userData && (
          <div className="user-info">
            <h3>Welcome {userData.username}</h3>
            <p>Email: {userData.email}</p>
            <p>Plan: {userData.currentPlan}</p>
          </div>
        )}
      </div>

      {/* Service Widget */}
      <div className="service-widget">
        <div className="service-icon">💬</div>
        <span className="service-text">Service</span>
      </div>
    </div>
  );
}

export default Login;
