import { useState, useEffect } from 'react';
import './LoginPage.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import gradBridgeLogoText from '../../assets/gradbridge-logotext-white.svg';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type LoginPageProps = {
  onLogin: () => void;
};

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setFadeIn(true); }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else {
          setError(`Login failed: ${signInError.message}`);
        }
        setIsLoading(false);
        return;
      }
      if (!data.user) {
        setError('Login failed: No user object was returned from the server.');
        setIsLoading(false);
        return;
      }
      onLogin();
      navigate('/home');
    } catch (err) {
      setError('A network or unexpected error occurred during login. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button
        className="signup-back-top-btn"
        onClick={() => navigate('/')}
        type="button"
        aria-label="Back to landing page"
      >
        <span className="chevron-left">&#8592;</span>
      </button>
      <div className={`login-card${fadeIn ? ' login-fade-in' : ' login-fade-init'}`}>
        <div className="logo-container">
          <div className="logo-wrapper">
            <img src={gradBridgeLogo} alt="GradBridge Logo" className="imported-logo" />
            <img src={gradBridgeLogoText} alt="GradBridge" className="imported-logo-text" />
          </div>
        </div>
        
        <h2 className="welcome-text">Welcome to GradBridge,</h2>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 