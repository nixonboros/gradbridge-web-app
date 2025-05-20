import { useEffect, useState } from 'react';
import Header from '../Header/Header';

type InterviewPageProps = {
  onSignOut?: () => void;
};

const InterviewPage = ({ onSignOut }: InterviewPageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className="home-root">
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className={`home-main-inner fade-init${fadeIn ? ' fade-in' : ''}`}>
          {/* Empty content for InterviewPage */}
          <h1>Interview</h1>
        </div>
      </main>
    </div>
  );
};

export default InterviewPage; 