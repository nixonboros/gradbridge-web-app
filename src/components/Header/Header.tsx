import './Header.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import { FiHome, FiShare2, FiFileText, FiUser, FiUsers, FiEdit2, FiLogOut } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import NotificationPanel from '../NotificationPanel/NotificationPanel';
import { useUser } from '../../contexts/UserContext';

interface HeaderProps {
  onSignOut?: () => void;
  showNavTabs?: boolean;
  showNotification?: boolean;
  showAvatar?: boolean;
  rightButton?: ReactNode;
}

const Header = ({
  onSignOut,
  showNavTabs = true,
  showNotification = true,
  showAvatar = true,
  rightButton
}: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { profilePicture, initial, isLoading } = useUser();

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

  const handleProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const handleEditProfile = () => {
    navigate('/profile?edit=true');
    setDropdownOpen(false);
  };

  return (
    <header className="home-header">
      <div className="home-header-left">
        <Link to="/">
          <img src={gradBridgeLogo} alt="GradBridge" className="home-logo" />
        </Link>
      </div>
      {showNavTabs && (
        <nav className="home-nav">
          <div className="tab-container">
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <FiHome className="nav-icon" />
              Home
            </Link>
            <Link to="/opportunities" className={`nav-item ${location.pathname === '/opportunities' ? 'active' : ''}`}>
              <FiFileText className="nav-icon" />
              Opportunities
            </Link>
            <Link to="/network" className={`nav-item ${location.pathname === '/network' ? 'active' : ''}`}>
              <FiUsers className="nav-icon" />
              Network
            </Link>
            <Link to="/share" className={`nav-item ${location.pathname === '/share' ? 'active' : ''}`}>
              <FiShare2 className="nav-icon" />
              Share
            </Link>
          </div>
        </nav>
      )}
      <div className="home-header-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{ width: 44, height: 44, marginRight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showNotification ? <NotificationPanel /> : <div style={{ width: 44, height: 44, visibility: 'hidden' }} />}
          </div>
          <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showAvatar ? (
              <div
                className="home-avatar"
                ref={avatarRef}
                onClick={() => setDropdownOpen((open) => !open)}
                tabIndex={0}
                style={{ 
                  position: 'relative',
                  background: isLoading ? '#e2e8f0' : (profilePicture ? 'none' : '#2563eb'),
                  transition: 'background-color 0.2s ease'
                }}
              >
                {isLoading ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#94a3b8'
                  }}>
                    ...
                  </div>
                ) : profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }} 
                  />
                ) : (
                  initial
                )}
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item" onClick={handleProfile} type="button">
                      <FiUser size={18} />
                      View Profile
                    </button>
                    <button className="dropdown-item" onClick={handleEditProfile} type="button">
                      <FiEdit2 size={18} />
                      Edit Profile
                    </button>
                    <button className="dropdown-item signout" onClick={onSignOut} type="button">
                      <FiLogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : <div style={{ width: 44, height: 44, visibility: 'hidden' }} />} 
          </div>
        </div>
        {rightButton}
      </div>
    </header>
  );
};

export default Header; 