import { useState, useRef, useEffect } from 'react';
import './HomePage.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import { FiBell, FiHome, FiShare2, FiFileText, FiUser, FiUsers } from 'react-icons/fi';

const HomePage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [fadeIn, setFadeIn] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className={`home-root${fadeIn ? ' home-fade-in' : ''}`}>
      <header className="home-header">
        <div className="home-header-left">
          <img src={gradBridgeLogo} alt="GradBridge" className="home-logo" />
        </div>
        
        <div className="home-nav">
          <div className="tab-container">
            <div className="nav-item active">
              <div className="nav-icon"><FiHome size={22} /></div>
              <span>Home</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon"><FiShare2 size={22} /></div>
              <span>Events</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon"><FiFileText size={22} /></div>
              <span>Resume</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon"><FiUsers size={22} /></div>
              <span>Interview</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon"><FiUser size={22} /></div>
              <span>Profile</span>
            </div>
          </div>
        </div>
        
        <div className="home-header-right">
          <FiBell className="home-bell" size={26} />
          <div
            className="home-avatar"
            ref={avatarRef}
            onClick={() => setDropdownOpen((open) => !open)}
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            A
            {dropdownOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item">View Profile</button>
                <button className="dropdown-item">Edit Profile</button>
                <button className="dropdown-item signout">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="home-main">
        <div className="home-main-inner">
          <h1 className="home-greeting">Hi Alexa!</h1>
          <div className="home-sections">
            <section className="home-section">
              <div className="home-section-title">Suggested Upcoming Events:</div>
              <div className="event-card">
                <div className="event-title">Amazon Meet, Ask, Solve, & Network</div>
                <div className="event-time">10:00 AM - 3:00 PM, 02/10/2024</div>
                <div className="event-location">Amazon Web Services Office, Sydney</div>
                <div className="event-desc">
                  Open to students from ALL disciplines there is place for you in Amazon Operations. Take a deep dive into the Amazon's culture, our Day 1 philosophy...
                  <span className="event-readmore">Read more →</span>
                </div>
              </div>
            </section>
            <section className="home-section">
              <div className="home-section-title">Upcoming Interviews:</div>
              <div className="interview-card">
                No upcoming scheduled mock interviews
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;