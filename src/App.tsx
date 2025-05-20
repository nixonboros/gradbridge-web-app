import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import EventsPage from './components/EventsPage/EventsPage';
import ResumePage from './components/ResumePage/ResumePage';
import InterviewPage from './components/InterviewPage/InterviewPage';
import SplashScreen from './components/SplashScreen/SplashScreen';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          loggedIn ? <Navigate to="/home" /> : <LoginPage onLogin={() => setLoggedIn(true)} />
        } />
        <Route path="/home" element={
          loggedIn ? <HomePage onSignOut={() => setLoggedIn(false)} /> : <Navigate to="/login" />
        } />
        <Route path="/events" element={loggedIn ? <EventsPage /> : <Navigate to="/login" />} />
        <Route path="/resume" element={loggedIn ? <ResumePage /> : <Navigate to="/login" />} />
        <Route path="/interview" element={loggedIn ? <InterviewPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
        <Route path="*" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
