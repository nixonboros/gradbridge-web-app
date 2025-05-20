import { useEffect, useState } from 'react';
import Header from '../Header/Header';

const InterviewPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className={`home-root${fadeIn ? ' home-fade-in' : ''}`}>
      <Header />
      <main className="home-main">
        <div className="home-main-inner">
          {/* Empty content for InterviewPage */}
        </div>
      </main>
    </div>
  );
};

export default InterviewPage; 