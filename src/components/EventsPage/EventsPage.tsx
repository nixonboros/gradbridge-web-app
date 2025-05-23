import { useEffect, useState } from 'react';
import Header from '../Header/Header';

type EventsPageProps = {
  onSignOut?: () => void;
};

const EventsPage = ({ onSignOut }: EventsPageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className="home-root">
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className={`home-main-inner fade-init${fadeIn ? ' fade-in' : ''}`}>
          {/* Empty content for EventsPage */}
          <h1>Events</h1>
        </div>
      </main>
      <footer className="profile-footer">
        © 2025 GradBridge. All rights reserved. From a capstone project to a fully functional app.
      </footer>
    </div>
  );
};

export default EventsPage; 