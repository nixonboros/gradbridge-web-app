import './ProfilePage.css';
import Header from '../Header/Header';
import { FiUser, FiMapPin, FiBriefcase, FiLinkedin, FiEye, FiDownload } from 'react-icons/fi';

const ProfilePage = ({ onSignOut }: { onSignOut?: () => void }) => {
  return (
    <div className="profile-root">
      <Header onSignOut={onSignOut} />
      <main className="profile-main">
        <div className="profile-main-inner fade-init fade-in">
          <section className="profile-header">
            <div className="profile-header-main">
              <div className="profile-header-left">
                <div className="profile-avatar">A</div>
                <div>
                  <h2 className="profile-name">Alexa</h2>
                  <div className="profile-email">alexa.j@gmail.com</div>
                  <div className="profile-major-badge">Computer Science</div>
                </div>
              </div>
              <div className="profile-header-actions">
                <button className="primary-btn">Edit Profile</button>
              </div>
            </div>
          </section>
          <div className="profile-content-grid">
            <aside className="profile-sidebar">
              <div className="profile-card">
                <h4>Profile Details</h4>
                <ul className="profile-details-list">
                  <li><FiUser className="profile-detail-icon" />25 years old</li>
                  <li><FiMapPin className="profile-detail-icon" />Sydney, Australia</li>
                  <li><FiBriefcase className="profile-detail-icon" />Software Engineer</li>
                  <li><FiLinkedin className="profile-detail-icon" /><a href="#" className="profile-link">linkedin.com/in/alexaj</a></li>
                </ul>
              </div>
              <div className="profile-card">
                <h4>Skills</h4>
                <div className="profile-skills">
                  <span className="skill-badge">JavaScript</span>
                  <span className="skill-badge">React</span>
                  <span className="skill-badge">Node.js</span>
                  <span className="skill-badge">Python</span>
                  <span className="skill-badge">SQL</span>
                  <span className="skill-badge">Cloud Computing</span>
                </div>
              </div>
            </aside>
            <section className="profile-main-content">
              <div className="profile-card profile-resume">
                <div className="profile-resume-header">
                  <h4>Resume/CV</h4>
                  <button className="profile-upload-btn">Upload New</button>
                </div>
                <div className="profile-resume-file">
                  <span className="profile-resume-filename">Alexa_Resume_2024.pdf</span>
                  <span className="profile-resume-date">Uploaded on Jan 15, 2024</span>
                  <div className="profile-resume-actions">
                    <button className="profile-resume-view"><FiEye /></button>
                    <button className="profile-resume-download"><FiDownload /></button>
                  </div>
                </div>
              </div>
              <div className="profile-card profile-about">
                <h4>About Me</h4>
                <p>Highly motivated and results-oriented software engineer with 3+ years of experience in developing and deploying web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about creating user-friendly and scalable solutions. Eager to contribute to a dynamic team and continuously learn new technologies.</p>
              </div>
              <div className="profile-card profile-experience">
                <h4>Experience</h4>
                <div className="profile-experience-item">
                  <div className="profile-experience-header">
                    <span className="profile-experience-role">Software Engineer</span>
                    <span className="profile-experience-dates">Jan 2022 - Present</span>
                  </div>
                  <div className="profile-experience-company">Tech Solutions Inc.</div>
                  <ul>
                    <li>Developed and maintained web applications using React and Node.js.</li>
                    <li>Collaborated with cross-functional teams to deliver high-quality software.</li>
                    <li>Participated in code reviews and provided constructive feedback.</li>
                  </ul>
                </div>
                <div className="profile-experience-item">
                  <div className="profile-experience-header">
                    <span className="profile-experience-role">Junior Software Developer</span>
                    <span className="profile-experience-dates">Jun 2020 - Dec 2021</span>
                  </div>
                  <div className="profile-experience-company">Innovatech Ltd.</div>
                  <ul>
                    <li>Assisted in the development of new features for existing applications.</li>
                    <li>Wrote unit tests and performed bug fixing.</li>
                    <li>Learned and applied new technologies under supervision.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className="profile-footer">
        © 2024 YourCompany. All rights reserved.
      </footer>
    </div>
  );
};

export default ProfilePage;