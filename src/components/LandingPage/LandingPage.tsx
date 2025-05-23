// src/components/LandingPage/LandingPage.tsx
import './LandingPage.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import { FiCalendar, FiFileText, FiUsers, FiShare2 } from 'react-icons/fi';
import { FaRegLightbulb } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  loggedIn: boolean;
  onSignOut?: () => void;
}

const LandingPage = ({ loggedIn, onSignOut }: LandingPageProps) => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className="landing-root">
      {loggedIn ? (
        <Header onSignOut={onSignOut} />
      ) : (
        <Header
          showNavTabs={false}
          showNotification={false}
          showAvatar={false}
          rightButton={
            <button
              className="primary-btn"
              style={{ padding: '10px 24px', fontSize: '1rem' }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          }
        />
      )}
      <div className={`fade-init${fadeIn ? ' fade-in' : ''}`}>
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <img src={gradBridgeLogo} alt="GradBridge" className="landing-logo" />
            <h1 className="landing-title">Bridge Your Future with AI</h1>
            <p className="landing-subtitle">
              GradBridge connects graduates with industry professionals and employers, enhanced by powerful AI tools for career success.
            </p>
            <div className="landing-cta">
              <button className="primary-btn" onClick={() => navigate('/signup')}>Get Started</button>
              <button className="secondary-btn">Learn More</button>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <h2>Unlock Your Career Potential</h2>
          <p>Discover events, perfect your resume, and ace interviews with our AI-powered platform.</p>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="icon-bg">
                <FiCalendar size={32} />
              </div>
              <h3>Event Management</h3>
              <p>Organize and discover networking events, workshops, and career fairs tailored to your interests and career goals.</p>
            </div>
            <div className="feature-card">
              <div className="icon-bg">
                <FiFileText size={32} />
              </div>
              <h3>AI-Driven Resume Assistance</h3>
              <p>Get personalized feedback and AI-powered suggestions to craft a resume that stands out to recruiters.</p>
            </div>
            <div className="feature-card">
              <div className="icon-bg">
                <FiUsers size={32} />
              </div>
              <h3>Mock Interview Simulations</h3>
              <p>Practice and prepare for real interviews with our AI-powered mock interview tools and receive instant feedback.</p>
            </div>
          </div>
        </section>

        <section className="landing-why">
          <h2>Why Choose GradBridge?</h2>
          <div className="why-content">
            <img
              className="why-image"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlWA085EjkAb6L0chKpbBbSwPsiios_CdX5b6tKFbuy83Lg9dNQkXlYJabqoKJCtf3DIXQdn0EuZABOxNcBpmPHVXH7kHHWzE-VktW5MyzP7v71ntTEW_PrtpLam7NbqiSOO-ehCovsmdHAOXxc4Rpu-m1rTij3lL8CFMzQeQmZ3UvP3Vs8ABap0HoQMDPMD90C6b2XrX0Gr3lTgK_DBGX_u1V9HKPRneXGIt7vDGNOuiQEMOfISHu0eUqxc8qcJMtpbquPm7zL6Q"
              alt="Diverse group of people collaborating"
            />
            <div className="why-list">
              <div className="why-item">
                <div className="why-icon-bg">
                  <FiShare2 size={24} />
                </div>
                <div>
                  <h4>Seamless Networking</h4>
                  <p>Connect effortlessly with peers, mentors, and potential employers in a supportive environment.</p>
                </div>
              </div>
              <div className="why-item">
                <div className="why-icon-bg">
                  <FaRegLightbulb size={24} />
                </div>
                <div>
                  <h4>AI-Powered Insights</h4>
                  <p>Leverage cutting-edge AI to gain a competitive edge in your job search and career development.</p>
                </div>
              </div>
              <div className="why-item">
                <div className="why-icon-bg">
                  <HiOutlineUserGroup size={24} />
                </div>
                <div>
                  <h4>Community Focused</h4>
                  <p>Join a vibrant community of graduates and professionals dedicated to mutual growth and success.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-cta-bottom">
          <h2>Ready to Take the Next Step?</h2>
          <p>Join GradBridge today and start building the career of your dreams.</p>
          <button className="primary-btn" onClick={() => navigate('/signup')}>Sign Up Now</button>
        </section>

        <footer className="landing-footer">
          <div className="footer-columns">
            <div>
              <strong>GradBridge</strong>
              <p>AI-Enhanced Networking & Recruitment Platform for Graduates.</p>
            </div>
            <div>
              <strong>Quick Links</strong>
              <ul>
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <strong>Features</strong>
              <ul>
                <li>Events</li>
                <li>Resume AI</li>
                <li>Mock Interviews</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 GradBridge. All rights reserved. From a capstone project to a fully functional app.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;