import Header from '../Header/Header';

type ProfilePageProps = {
  onSignOut?: () => void;
};

const ProfilePage = ({ onSignOut }: ProfilePageProps) => {
  return (
    <div className="home-root">
      <Header onSignOut={onSignOut} />
      <main className="home-main">
        <div className="home-main-inner fade-init fade-in">
          <h1>Profile</h1>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;