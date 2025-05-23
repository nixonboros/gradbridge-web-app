import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import EventsPage from './components/EventsPage/EventsPage';
import ResumePage from './components/ResumePage/ResumePage';
import InterviewPage from './components/InterviewPage/InterviewPage';
import SplashScreen from './components/SplashScreen/SplashScreen';
import SignUpPage from './components/SignUpPage/SignUpPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
  };

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  if (showSplash) return <SplashScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage loggedIn={loggedIn} onSignOut={() => {
          handleSignOut();
          window.location.href = '/login';
        }} />} />
        <Route path="/login" element={
          loggedIn ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={
          loggedIn ? <HomePage onSignOut={handleSignOut} /> : <Navigate to="/login" />
        } />
        <Route path="/events" element={
          loggedIn ? <EventsPage onSignOut={handleSignOut} /> : <Navigate to="/login" />
        } />
        <Route path="/resume" element={
          loggedIn ? <ResumePage onSignOut={handleSignOut} /> : <Navigate to="/login" />
        } />
        <Route path="/interview" element={
          loggedIn ? <InterviewPage onSignOut={handleSignOut} /> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          loggedIn ? <ProfilePage onSignOut={handleSignOut} /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
