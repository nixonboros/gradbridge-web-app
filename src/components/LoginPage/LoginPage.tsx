import { useState, useEffect } from 'react';
import './LoginPage.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';
import gradBridgeLogoText from '../../assets/gradbridge-logotext-white.svg';

type LoginPageProps = {
  onLogin: () => void;
};

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => { setFadeIn(true); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-container">
      <div className={`login-card${fadeIn ? ' login-fade-in' : ' login-fade-init'}`}>
        <div className="logo-container">
          <div className="logo-wrapper">
            <img src={gradBridgeLogo} alt="GradBridge Logo" className="imported-logo" />
            <img src={gradBridgeLogoText} alt="GradBridge" className="imported-logo-text" />
          </div>
        </div>
        
        <h2 className="welcome-text">Welcome to GradBridge,</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
              required
            />
          </div>
          
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          
          <button type="submit" className="login-btn">Log In</button>
        </form>
        
        <div className="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 