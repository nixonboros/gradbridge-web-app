// src/components/LandingPage/LandingPage.tsx
import './LandingPage.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import { FiCalendar, FiFileText, FiUsers, FiCheckCircle } from 'react-icons/fi';
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
      <div className="header-shadow" />
      {loggedIn ? (
        <Header onSignOut={onSignOut} />
      ) : (
        <Header
          showNavTabs={false}
          showNotification={false}
          showAvatar={false}
          rightButton={
            <button
              className="primary-btn modern-btn"
              style={{ padding: '12px 32px', fontSize: '1.1rem' }}
              onClick={() => navigate('/login')}
              aria-label="Sign In"
            >
              Sign In
            </button>
          }
        />
      )}
      <div className={`fade-init${fadeIn ? ' fade-in' : ''}`}>
        <section className="landing-hero modern-hero refined-hero fade-in-section">
          <div className="hero-bg-gradient" />
          <svg className="hero-wave" viewBox="0 0 1440 320"><path fill="#dbeafe" fillOpacity="1" d="M0,224L48,197.3C96,171,192,117,288,117.3C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,101.3C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
          <div className="landing-hero-inner refined-hero-inner">
            <img src={gradBridgeLogo} alt="GradBridge" className="landing-logo modern-logo refined-logo" />
            <h1 className="landing-title modern-title refined-title">Bridge Your Future with <span className="accent">AI</span></h1>
            <p className="landing-subtitle modern-subtitle refined-subtitle">
              GradBridge connects graduates with industry professionals and employers, enhanced by powerful AI tools for career success.
            </p>
            <div className="landing-cta modern-cta refined-cta">
              <button className="primary-btn modern-btn refined-btn" onClick={() => navigate('/signup')} aria-label="Get Started">Get Started</button>
              <button className="secondary-btn modern-btn refined-btn" onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} aria-label="Learn More">Learn More</button>
            </div>
          </div>
        </section>
        <svg className="section-divider" viewBox="0 0 1440 80"><path fill="#f8fafc" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,53.3C672,43,768,21,864,16C960,11,1056,21,1152,32C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
        <section className="landing-features modern-features refined-features fade-in-section">
          <h2 className="refined-section-title">Unlock Your Career Potential</h2>
          <p className="refined-section-subtitle">Discover events, perfect your resume, and ace interviews with our AI-powered platform.</p>
          <div className="feature-cards refined-feature-cards">
            <div className="feature-card modern-feature-card refined-feature-card">
              <div className="icon-bg modern-icon-bg refined-icon-bg">
                <FiCalendar size={32} />
              </div>
              <h3>Event Management</h3>
              <p>Organize and discover networking events, workshops, and career fairs tailored to your interests and career goals.</p>
              <a className="feature-learn-more" href="#" aria-label="Learn more about Event Management">Learn more &rarr;</a>
            </div>
            <div className="feature-card modern-feature-card refined-feature-card">
              <div className="icon-bg modern-icon-bg refined-icon-bg">
                <FiFileText size={32} />
              </div>
              <h3>AI-Driven Resume Assistance</h3>
              <p>Get personalized feedback and AI-powered suggestions to craft a resume that stands out to recruiters.</p>
              <a className="feature-learn-more" href="#" aria-label="Learn more about Resume Assistance">Learn more &rarr;</a>
            </div>
            <div className="feature-card modern-feature-card refined-feature-card">
              <div className="icon-bg modern-icon-bg refined-icon-bg">
                <FiUsers size={32} />
              </div>
              <h3>Mock Interview Simulations</h3>
              <p>Practice and prepare for real interviews with our AI-powered mock interview tools and receive instant feedback.</p>
              <a className="feature-learn-more" href="#" aria-label="Learn more about Mock Interviews">Learn more &rarr;</a>
            </div>
          </div>
        </section>
        <section className="landing-why modern-why refined-why fade-in-section">
          <h2 className="refined-section-title">Why Choose GradBridge?</h2>
          <div className="why-content refined-why-content">
            <img
              className="why-image modern-why-image refined-why-image"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlWA085EjkAb6L0chKpbBbSwPsiios_CdX5b6tKFbuy83Lg9dNQkXlYJabqoKJCtf3DIXQdn0EuZABOxNcBpmPHVXH7kHHWzE-VktW5MyzP7v71ntTEW_PrtpLam7NbqiSOO-ehCovsmdHAOXxc4Rpu-m1rTij3lL8CFMzQeQmZ3UvP3Vs8ABap0HoQMDPMD90C6b2XrX0Gr3lTgK_DBGX_u1V9HKPRneXGIt7vDGNOuiQEMOfISHu0eUqxc8qcJMtpbquPm7zL6Q"
              alt="Diverse group of people collaborating"
            />
            <div className="why-list refined-why-list">
              <div className="why-item modern-why-item refined-why-item">
                <div className="why-icon-bg modern-why-icon-bg refined-why-icon-bg">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h4>Seamless Networking</h4>
                  <p>Connect effortlessly with peers, mentors, and potential employers in a supportive environment.</p>
                </div>
              </div>
              <div className="why-item modern-why-item refined-why-item">
                <div className="why-icon-bg modern-why-icon-bg refined-why-icon-bg">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h4>AI-Powered Insights</h4>
                  <p>Leverage cutting-edge AI to gain a competitive edge in your job search and career development.</p>
                </div>
              </div>
              <div className="why-item modern-why-item refined-why-item">
                <div className="why-icon-bg modern-why-icon-bg refined-why-icon-bg">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h4>Community Focused</h4>
                  <p>Join a vibrant community of graduates and professionals dedicated to mutual growth and success.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-cta-bottom modern-cta-bottom refined-cta-bottom fade-in-section">
          <h2 className="refined-section-title">Ready to Take the Next Step?</h2>
          <p className="refined-section-subtitle">Join GradBridge today and start building the career of your dreams.</p>
          <button className="primary-btn modern-btn refined-btn" onClick={() => navigate('/signup')} aria-label="Sign Up Now">Sign Up Now</button>
        </section>
        <footer className="landing-footer modern-footer refined-footer">
          <div className="footer-columns refined-footer-columns">
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
          <div className="footer-bottom refined-footer-bottom">
            © 2025 GradBridge. All rights reserved. From a capstone project to a fully functional app.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;