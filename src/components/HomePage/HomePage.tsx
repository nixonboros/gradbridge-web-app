import './HomePage.css';
import gradBridgeLogoText from '../../assets/gradbridge-logotext.svg';
import { FiBell, FiHome, FiShare2, FiFileText, FiUser, FiUsers } from 'react-icons/fi';

const HomePage = () => (
  <div className="home-container">
    <header className="home-header">
      <img src={gradBridgeLogoText} alt="GradBridge" className="home-logo" />
      <FiBell className="home-bell" size={24} />
    </header>
    <main className="home-main">
      <h1 className="home-greeting">Hi Alexa!</h1>
      <div className="home-section">
        <div className="home-section-title">Suggested Upcoming Events:</div>
        <div className="event-card">
          <div className="event-title">Amazon Meet, Ask, Solve, & Network</div>
          <div className="event-time">10:00 AM - 3:00 PM, 02/10/2024</div>
          <div className="event-location">Amazon Web Services Office, Sydney</div>
          <div className="event-desc">
            Open to students from ALL disciplines... <br />
            <span className="event-readmore">Read more →</span>
          </div>
        </div>
      </div>
      <div className="home-section">
        <div className="home-section-title">Upcoming Interviews:</div>
        <div className="interview-card">
          No upcoming scheduled mock interviews
        </div>
      </div>
    </main>
    <nav className="home-nav">
      <div className="nav-item active"><FiHome size={22} /><span>Home</span></div>
      <div className="nav-item"><FiShare2 size={22} /><span>Network</span></div>
      <div className="nav-item"><FiFileText size={22} /><span>AI</span></div>
      <div className="nav-item"><FiUsers size={22} /><span>Mentors</span></div>
      <div className="nav-item"><FiUser size={22} /><span>Profile</span></div>
    </nav>
  </div>
);

export default HomePage;