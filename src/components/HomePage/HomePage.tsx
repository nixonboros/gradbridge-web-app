import { useState, useRef, useEffect } from 'react';
import './HomePage.css';
import { FiCalendar, FiMapPin, FiClock, FiPlus, FiChevronRight } from 'react-icons/fi';
import Header from '../Header/Header';

type HomePageProps = {
  onSignOut: () => void;
};

const HomePage = ({ onSignOut }: HomePageProps) => {
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
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className="home-main-inner">
          <h1 className="home-greeting">Welcome back, Alexa!</h1>
          <div className="home-sections">
            <section className="home-section">
              <div className="home-section-title">
                <span>Upcoming Events</span>
                <button>
                  <FiPlus size={18} />
                  Add Event
                </button>
              </div>
              <div className="event-cards-grid">
                <div className="event-card">
                  <div className="event-title">Amazon Meet, Ask, Solve, & Network</div>
                  <div className="event-time">
                    <FiClock size={16} />
                    10:00 AM - 3:00 PM, 02/10/2024
                  </div>
                  <div className="event-location">
                    <FiMapPin size={16} />
                    Amazon Web Services Office, Sydney
                  </div>
                  <div className="event-desc">
                    Open to students from ALL disciplines there is place for you in Amazon Operations. Take a deep dive into the Amazon's culture, our Day 1 philosophy...
                  </div>
                  <div className="event-readmore">
                    Read more
                    <FiChevronRight size={16} />
                  </div>
                </div>
                <div className="event-card">
                  <div className="event-title">Google Tech Talk: AI & Machine Learning</div>
                  <div className="event-time">
                    <FiClock size={16} />
                    2:00 PM - 4:00 PM, 02/15/2024
                  </div>
                  <div className="event-location">
                    <FiMapPin size={16} />
                    Google Office, Melbourne
                  </div>
                  <div className="event-desc">
                    Join us for an exciting tech talk about the latest developments in AI and Machine Learning. Network with Google engineers and learn about career opportunities...
                  </div>
                  <div className="event-readmore">
                    Read more
                    <FiChevronRight size={16} />
                  </div>
                </div>
                <div className="event-card">
                  <div className="event-title">Microsoft Career Fair 2024</div>
                  <div className="event-time">
                    <FiClock size={16} />
                    9:00 AM - 5:00 PM, 02/20/2024
                  </div>
                  <div className="event-location">
                    <FiMapPin size={16} />
                    Microsoft Office, Brisbane
                  </div>
                  <div className="event-desc">
                    Meet Microsoft recruiters and learn about internship and full-time opportunities. Bring your resume and be ready to network with industry professionals...
                  </div>
                  <div className="event-readmore">
                    Read more
                    <FiChevronRight size={16} />
                  </div>
                </div>
              </div>
            </section>

            <section className="home-section">
              <div className="home-section-title">
                <span>Interview Schedule</span>
                <button>
                  <FiPlus size={18} />
                  Schedule Interview
                </button>
              </div>
              <div className="interview-card">
                <FiCalendar size={32} style={{ marginBottom: '16px', color: '#2563eb' }} />
                <div>No upcoming interviews scheduled</div>
                <button style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  Schedule Now
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;