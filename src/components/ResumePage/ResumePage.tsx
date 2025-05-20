import { useState, useRef, useEffect } from 'react';
import '../HomePage/HomePage.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import { FiBell, FiHome, FiShare2, FiFileText, FiUser, FiUsers } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Header/Header';

const ResumePage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [fadeIn, setFadeIn] = useState(false);
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

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className={`home-root${fadeIn ? ' home-fade-in' : ''}`}>
      <Header />
      <main className="home-main">
        <div className="home-main-inner">
          {/* Empty content for ResumePage */}
        </div>
      </main>
    </div>
  );
};

export default ResumePage; 