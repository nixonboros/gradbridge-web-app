import './Header.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import { FiBell, FiHome, FiShare2, FiFileText, FiUser, FiUsers } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Header = ({ onSignOut }: { onSignOut?: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  return (
    <header className="home-header">
      <div className="home-header-left">
        <img src={gradBridgeLogo} alt="GradBridge" className="home-logo" />
      </div>
      <div className="home-nav">
        <div className="tab-container">
          <Link to="/home" className={`nav-item${location.pathname === '/home' ? ' active' : ''}`}>
            <div className="nav-icon"><FiHome size={22} /></div>
            <span>Home</span>
          </Link>
          <Link to="/events" className={`nav-item${location.pathname === '/events' ? ' active' : ''}`}>
            <div className="nav-icon"><FiShare2 size={22} /></div>
            <span>Events</span>
          </Link>
          <Link to="/resume" className={`nav-item${location.pathname === '/resume' ? ' active' : ''}`}>
            <div className="nav-icon"><FiFileText size={22} /></div>
            <span>Resume</span>
          </Link>
          <Link to="/interview" className={`nav-item${location.pathname === '/interview' ? ' active' : ''}`}>
            <div className="nav-icon"><FiUsers size={22} /></div>
            <span>Interview</span>
          </Link>
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
              <button className="dropdown-item">
                <FiUser size={18} />
                View Profile
              </button>
              <button className="dropdown-item">
                <FiUser size={18} />
                Edit Profile
              </button>
              <button className="dropdown-item signout" onClick={onSignOut}>
                <FiUser size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 