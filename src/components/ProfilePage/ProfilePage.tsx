import './ProfilePage.css';
import Header from '../Header/Header';
import { FiUser, FiMapPin, FiBriefcase, FiLinkedin, FiEye, FiDownload, FiUpload, FiFileText, FiEdit2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  name: string;
  email: string;
  age: string;
  location: string;
  role: string;
  linkedin: string;
  about: string;
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    dates: string;
    description: string[];
  }>;
}

interface ProfilePageProps {
  onSignOut?: () => void;
  initialEditMode?: boolean;
}

const ProfilePage = ({ onSignOut, initialEditMode = false }: ProfilePageProps) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Alexa Peterson',
    email: 'alexa.j@gmail.com',
    age: '25',
    location: 'Sydney, Australia',
    role: 'Software Engineer',
    linkedin: 'linkedin.com/in/alexaj',
    about: 'Highly motivated and results-oriented software engineer with 3+ years of experience in developing and deploying web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about creating user-friendly and scalable solutions. Eager to contribute to a dynamic team and continuously learn new technologies.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'TypeScript'],
    experience: [
      {
        role: 'Software Engineer',
        company: 'Tech Solutions Inc.',
        dates: 'Jan 2022 - Present',
        description: [
          'Developed and maintained web applications using React and Node.js.',
          'Collaborated with cross-functional teams to deliver high-quality software.',
          'Participated in code reviews and provided constructive feedback.'
        ]
      },
      {
        role: 'Junior Software Developer',
        company: 'Innovatech Ltd.',
        dates: 'Jun 2020 - Dec 2021',
        description: [
          'Assisted in the development of new features for existing applications.',
          'Wrote unit tests and performed bug fixing.',
          'Learned and applied new technologies under supervision.'
        ]
      }
    ]
  });

  useEffect(() => {
    setEditMode(initialEditMode);
  }, [initialEditMode]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save profile data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setEditMode(false);
      navigate('/profile'); // Remove edit=true from URL
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // TODO: Reset form data to original values
    setEditMode(false);
    navigate('/profile'); // Remove edit=true from URL
  };

  const handleEditClick = () => {
    setEditMode(true);
    navigate('/profile?edit=true'); // Add edit=true to URL
  };

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
                  <h2 className="profile-name">{profileData.name}</h2>
                  <div className="profile-email">{profileData.email}</div>
                </div>
              </div>
              <div className="profile-header-actions">
                {!editMode && (
                  <button className="profile-edit-btn" onClick={handleEditClick}>
                    <FiEdit2 style={{ fontSize: '1.1em', marginRight: 6 }} />
                    Edit Profile
                  </button>
                )}
                {editMode && (
                  <>
                    <button 
                      className="profile-edit-btn profile-save-btn" 
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      className="profile-edit-btn profile-cancel-btn" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
          <div className="profile-content-grid">
            <aside className="profile-sidebar">
              <div className="profile-card">
                <h4>Profile Details</h4>
                <ul className="profile-details-list">
                  <li><FiUser className="profile-detail-icon" />{profileData.age} years old</li>
                  <li><FiMapPin className="profile-detail-icon" />{profileData.location}</li>
                  <li><FiBriefcase className="profile-detail-icon" />{profileData.role}</li>
                  <li><FiLinkedin className="profile-detail-icon" /><a href="#" className="profile-link">{profileData.linkedin}</a></li>
                </ul>
              </div>
              <div className="profile-card">
                <h4>Skills</h4>
                <div className="profile-skills">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            </aside>
            <section className="profile-main-content">
              <div className="profile-card profile-resume">
                <div className="profile-resume-header">
                  <h4>Resume/CV</h4>
                  <button className="profile-upload-btn">
                    <FiUpload style={{ fontSize: '1.1em', marginRight: 4 }} />
                    Upload New
                  </button>
                </div>
                <div className="profile-resume-file">
                  <FiFileText className="profile-resume-fileicon" />
                  <div>
                    <span className="profile-resume-filename">Alexa_Resume_2024.pdf</span>
                    <span className="profile-resume-date">Uploaded on Jan 15, 2024</span>
                  </div>
                  <div className="profile-resume-actions">
                    <button className="profile-resume-view"><FiEye /></button>
                    <button className="profile-resume-download"><FiDownload /></button>
                  </div>
                </div>
              </div>
              <div className="profile-card profile-about">
                <h4>About Me</h4>
                <p>{profileData.about}</p>
              </div>
              <div className="profile-card profile-experience">
                <h4>Experience</h4>
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="profile-experience-item">
                    <div className="profile-experience-header">
                      <span className="profile-experience-role">{exp.role}</span>
                      <span className="profile-experience-dates">{exp.dates}</span>
                    </div>
                    <div className="profile-experience-company">{exp.company}</div>
                    <ul>
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className="profile-footer">
        © 2025 GradBridge. All rights reserved. From a capstone project to a fully functional app.
      </footer>
    </div>
  );
};

export default ProfilePage;
