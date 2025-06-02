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
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { UserProvider } from './contexts/UserContext';

interface ProfileRouteProps {
  onSignOut: () => void;
}

function ProfileRoute({ onSignOut }: ProfileRouteProps) {
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  
  return (
    <ProfilePage 
      onSignOut={onSignOut} 
      initialEditMode={isEditMode}
    />
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    setLoggedIn(false);
  };

  if (showSplash) return <SplashScreen />;

  return (
    <UserProvider>
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
            loggedIn ? <ProfileRoute onSignOut={handleSignOut} /> : <Navigate to="/login" />
          } />
          <Route path="*" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
