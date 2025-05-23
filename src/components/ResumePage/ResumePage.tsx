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
      <footer className="profile-footer">
        © 2025 GradBridge. All rights reserved. From a capstone project to a fully functional app.
      </footer>
    </div>
  );
};

export default ResumePage; 