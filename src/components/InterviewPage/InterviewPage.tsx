import { useEffect, useState } from 'react';
import Header from '../Header/Header';

type InterviewPageProps = {
  onSignOut?: () => void;
};

const InterviewPage = ({ onSignOut }: InterviewPageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className={`home-root fade-init${fadeIn ? ' fade-in' : ''}`}>
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className="home-main-inner">
          {/* Empty content for InterviewPage */}
        </div>
      </main>
    </div>
  );
};

export default InterviewPage; 