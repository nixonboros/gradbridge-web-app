import { useEffect, useState } from 'react';
import Header from '../Header/Header';

type EventsPageProps = {
  onSignOut?: () => void;
};

const EventsPage = ({ onSignOut }: EventsPageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className={`home-root fade-init${fadeIn ? ' fade-in' : ''}`}>
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className="home-main-inner">
          {/* Empty content for EventsPage */}
        </div>
      </main>
    </div>
  );
};

export default EventsPage; 