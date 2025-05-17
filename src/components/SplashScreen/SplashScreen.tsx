import './SplashScreen.css';
import gradBridgeLogo from '../../assets/gradbridge-logo.svg';

const SplashScreen = () => (
  <div className="splash-screen">
    <img src={gradBridgeLogo} alt="GradBridge Logo" className="splash-logo" />
  </div>
);

export default SplashScreen;
