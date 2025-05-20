import { useEffect, useState } from 'react';
import Header from '../Header/Header';

type ResumePageProps = {
  onSignOut?: () => void;
};

const ResumePage = ({ onSignOut }: ResumePageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className="home-root">
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className={`home-main-inner fade-init${fadeIn ? ' fade-in' : ''}`}>
          {/* Empty content for ResumePage */}
          <h1>Resume</h1>
        </div>
      </main>
    </div>
  );
};

export default ResumePage; 