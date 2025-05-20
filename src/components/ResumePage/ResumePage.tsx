import { useEffect, useState } from 'react';
import Header from '../Header/Header';

type ResumePageProps = {
  onSignOut?: () => void;
};

const ResumePage = ({ onSignOut }: ResumePageProps) => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className={`home-root fade-init${fadeIn ? ' fade-in' : ''}`}>
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className="home-main-inner">
          {/* Empty content for ResumePage */}
        </div>
      </main>
    </div>
  );
};

export default ResumePage; 