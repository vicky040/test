import './ComingSoon.css';
import { useNavigate } from 'react-router-dom';

function ComingSoon() {

    const navigate = useNavigate();

  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        {/* Header */}
        <header className="coming-soon-header">
          <button className="back-btn" onClick={() => {navigate(-1)}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <div className="coming-soon-content">
          {/* Animated Icon */}
          <div className="coming-soon-icon">
            <div className="rocket">
              <div className="rocket-body">
                <div className="rocket-window"></div>
                <div className="rocket-flame"></div>
              </div>
            </div>
            <div className="stars">
              <span className="star star-1">✨</span>
              <span className="star star-2">⭐</span>
              <span className="star star-3">✨</span>
              <span className="star star-4">⭐</span>
              <span className="star star-5">✨</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="coming-soon-title">Coming Soon</h1>

          {/* Subtitle */}
          <p className="coming-soon-subtitle">
            We're working hard to bring you something amazing!
          </p>

          {/* Description */}
          <p className="coming-soon-description">
            This feature is currently under development. Stay tuned for exciting updates and new functionality that will enhance your trading experience.
          </p>

          {/* Progress Indicator */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Development in Progress...</span>
          </div>

          {/* Go Back Button */}
          <button className="go-back-btn" onClick={() => {navigate(-1)}} >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Go Back
          </button>
        </div>

        {/* Background Elements */}
        <div className="background-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
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

export default ComingSoon;