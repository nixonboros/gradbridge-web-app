import { useState, useEffect } from 'react';
import './HomePage.css';
import { FiCalendar, FiMapPin, FiClock, FiChevronRight, FiUsers } from 'react-icons/fi';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type HomePageProps = {
  onSignOut: () => void;
};

const HomePage = ({ onSignOut }: HomePageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [firstName, setFirstName] = useState('there');
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.full_name) {
        setFirstName(user.user_metadata.full_name.split(' ')[0]);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => { setFadeIn(true); }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="home-root">
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className={`home-main-inner fade-init${fadeIn ? ' fade-in' : ''}`}> 
          <div className="home-greeting">{getGreeting()}, {firstName}!</div>
          {/* Two-column grid: Events, Interview*/}
          <section className="home-section" style={{gridColumn: '1/2'}}>
            <div className="home-section-title">
              <FiCalendar className="section-title-icon" /> Upcoming Events
              <Link to="/events" className="see-all-btn">See all</Link>
            </div>
            <div className="home-section-subtitle">Events and opportunities tailored for you</div>
            <div className="event-list">
              <div className="event-card" tabIndex={0}>
                <div className="event-icon"><FiCalendar /></div>
                <div className="event-card-content">
                  <div className="event-title">Amazon Meet, Ask, Solve, & Network</div>
                  <div className="event-time"><FiClock /> 10:00 AM - 3:00 PM, 02/10/2024</div>
                  <div className="event-location"><FiMapPin /> Amazon Web Services Office, Sydney</div>
                  <div className="event-desc">Open to students from ALL disciplines there is place for you in Amazon Operations. Take a deep dive into the Amazon's culture, our Day 1 philosophy...</div>
                  <div className="event-readmore">Read more <FiChevronRight /></div>
            </div>
          </div>
              <div className="event-card" tabIndex={0}>
                <div className="event-icon"><FiCalendar /></div>
                <div className="event-card-content">
                  <div className="event-title">Google Tech Talk: AI & Machine Learning</div>
                  <div className="event-time"><FiClock /> 2:00 PM - 4:00 PM, 02/15/2024</div>
                  <div className="event-location"><FiMapPin /> Google Office, Melbourne</div>
                  <div className="event-desc">Join us for an exciting tech talk about the latest developments in AI and Machine Learning. Network with Google engineers and learn about career opportunities...</div>
                  <div className="event-readmore">Read more <FiChevronRight /></div>
        </div>
              </div>
              <div className="event-card" tabIndex={0}>
                <div className="event-icon"><FiCalendar /></div>
                <div className="event-card-content">
                  <div className="event-title">Microsoft Career Fair 2024</div>
                  <div className="event-time"><FiClock /> 9:00 AM - 5:00 PM, 02/20/2024</div>
                  <div className="event-location"><FiMapPin /> Microsoft Office, Brisbane</div>
                  <div className="event-desc">Meet Microsoft recruiters and learn about internship and full-time opportunities. Bring your resume and be ready to network with industry professionals...</div>
                  <div className="event-readmore">Read more <FiChevronRight /></div>
          </div>
        </div>
            </div>
          </section>
          <section className="home-section" style={{gridColumn: '2/3'}}>
            <div className="home-section-title">
              <FiUsers className="section-title-icon" /> Interview Schedule
              <Link to="/interview" className="see-all-btn">See all</Link>
            </div>
            <div className="home-section-subtitle">Your upcoming interviews and details</div>
            <div className="interview-list">
              <div className="interview-card" tabIndex={0}>
                <div className="event-icon"><FiCalendar /></div>
                <div className="event-card-content">
                  <div className="event-title">Software Engineer Interview</div>
                  <div className="event-time"><FiClock /> 11:00 AM - 12:00 PM, 02/18/2024</div>
                  <div className="event-location"><FiMapPin /> Google Office, Sydney</div>
                  <div className="event-desc">Prepare your resume and portfolio. Good luck!</div>
                  <div className="interview-readmore">View Details <FiChevronRight /></div>
                </div>
              </div>
              <div className="interview-card" tabIndex={0}>
                <div className="event-icon"><FiCalendar /></div>
                <div className="event-card-content">
                  <div className="event-title">Product Manager Interview</div>
                  <div className="event-time"><FiClock /> 2:00 PM - 3:00 PM, 02/20/2024</div>
                  <div className="event-location"><FiMapPin /> Microsoft Office, Melbourne</div>
                  <div className="event-desc">Review the product case study sent by the recruiter.</div>
                  <div className="interview-readmore">View Details <FiChevronRight /></div>
                </div>
              </div>
              <div className="interview-card" tabIndex={0}>
                <div className="event-icon"><FiCalendar /></div>
                <div className="event-card-content">
                  <div className="event-title">Data Scientist Interview</div>
                  <div className="event-time"><FiClock /> 3:30 PM - 4:30 PM, 02/22/2024</div>
                  <div className="event-location"><FiMapPin /> Amazon Office, Sydney</div>
                  <div className="event-desc">Prepare for technical questions on machine learning and data analysis.</div>
                  <div className="interview-readmore">View Details <FiChevronRight /></div>
                </div>
              </div>
              </div>
            </section>
        </div>
      </main>
      <footer className="profile-footer">
        © 2025 GradBridge. All rights reserved. From a capstone project to a fully functional app.
      </footer>
    </div>
  );
};

export default HomePage;