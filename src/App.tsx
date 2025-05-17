import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import SplashScreen from './components/SplashScreen/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200); // 1.2s delay + 1s animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      {showSplash && <SplashScreen />}
      <LoginPage />
    </div>
  );
}

export default App;
