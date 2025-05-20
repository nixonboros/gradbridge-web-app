import { useEffect, useState } from 'react';
import Header from '../Header/Header';

const ResumePage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => { setFadeIn(true); }, []);
  return (
    <div className={`home-root${fadeIn ? ' home-fade-in' : ''}`}>
      <Header />
      <main className="home-main">
        <div className="home-main-inner">
          {/* Empty content for ResumePage */}
        </div>
      </main>
    </div>
  );
};

export default ResumePage; 