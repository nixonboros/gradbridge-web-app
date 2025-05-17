import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import SplashScreen from './components/SplashScreen/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="app-fade-in">
          {loggedIn ? (
            <HomePage onSignOut={() => setLoggedIn(false)} />
          ) : (
            <LoginPage onLogin={() => setLoggedIn(true)} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
