import './ProfilePage.css';
import Header from '../Header/Header';
import { FiUser, FiMapPin, FiBriefcase, FiLinkedin, FiEye, FiDownload, FiUpload, FiFileText, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Experience {
  role: string;
  company: string;
  startDate: string; // ISO string
  endDate: string; // ISO string or ''
  currentlyWorking: boolean;
  description: string[];
}

interface ProfileData {
  name: string;
  email: string;
  age: string;
  location: string;
  role: string;
  linkedin: string;
  about: string;
  skills: string[];
  experience: Experience[];
}

interface ProfilePageProps {
  onSignOut?: () => void;
  initialEditMode?: boolean;
}

const ProfilePage = ({ onSignOut, initialEditMode = false }: ProfilePageProps) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // New state for editing
  const [newSkill, setNewSkill] = useState<string>('');
  const [newExperience, setNewExperience] = useState<Experience>({
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: ['']
  });

  // Fetch user and profile data from Supabase on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      setFetchError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setFetchError('User not logged in.');
          setFetching(false);
          return;
        }
        const userId = user.id;
        // Fetch profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('age, location, role, linkedin, experience, resume_url, profile_picture_url, id, about, skills')
          .eq('id', userId)
          .single();
        if (profileError || !profile) {
          setFetchError('Failed to fetch profile.');
          setFetching(false);
          return;
        }
        // Fetch user info from users table
        const { data: userInfo, error: userError } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', userId)
          .single();
        if (userError || !userInfo) {
          setFetchError('Failed to fetch user info.');
          setFetching(false);
          return;
        }
        setProfileData({
          name: userInfo.full_name || '',
          email: userInfo.email || '',
          age: profile.age !== undefined && profile.age !== null ? String(profile.age) : '',
          location: profile.location || '',
          role: profile.role || '',
          linkedin: profile.linkedin || '',
          about: profile.about || '',
          skills: profile.skills || [],
          experience: profile.experience || [],
        });
      } catch (err) {
        setFetchError('An error occurred while fetching profile.');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
    setEditMode(initialEditMode);
  }, [initialEditMode]);

  useEffect(() => {
    setEditMode(initialEditMode);
  }, [initialEditMode]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !profileData) {
        setIsLoading(false);
        return;
      }
      const userId = user.id;
      // Update users table (for name)
      const { error: userError } = await supabase
        .from('users')
        .update({ full_name: profileData.name })
        .eq('id', userId);
      // Update profiles table (for profile info)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          age: profileData.age ? Number(profileData.age) : null,
          location: profileData.location,
          role: profileData.role || null,
          linkedin: profileData.linkedin || null,
          experience: profileData.experience || [],
          about: profileData.about || null,
          skills: profileData.skills || [],
          // resume_url: null, // ignore for now
          // profile_picture_url: null, // ignore for now
        })
        .eq('id', userId);
      if (userError || profileError) {
        // handle error (show message, etc)
        alert('Failed to update profile. Please try again.');
        setIsLoading(false);
        return;
      }
      setEditMode(false);
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (profileData) {
      setProfileData({
        name: profileData.name,
        email: profileData.email,
        age: profileData.age,
        location: profileData.location,
        role: profileData.role,
        linkedin: profileData.linkedin,
        about: profileData.about,
        skills: profileData.skills,
        experience: profileData.experience,
      });
    }
    setEditMode(false);
    navigate('/profile');
  };

  const handleEditClick = () => {
    setEditMode(true);
    navigate('/profile?edit=true');
  };

  // New handlers for editing
  const handleProfileDataChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleAddSkill = () => {
    if (!profileData) return;
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => prev ? {
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      } : prev);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profileData) return;
    setProfileData(prev => prev ? {
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    } : prev);
  };

  const handleAddExperience = () => {
    if (!profileData) return;
    if (newExperience.role && newExperience.company && newExperience.startDate && (newExperience.currentlyWorking || newExperience.endDate)) {
      setProfileData(prev => prev ? {
        ...prev,
        experience: [...prev.experience, {
          ...newExperience,
          startDate: newExperience.startDate.slice(0, 7),
          endDate: newExperience.endDate ? newExperience.endDate.slice(0, 7) : '',
        }]
      } : prev);
      setNewExperience({
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: ['']
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    if (!profileData) return;
    setProfileData(prev => prev ? {
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    } : prev);
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: any) => {
    if (!profileData) return;
    setProfileData(prev => prev ? {
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? {
          ...exp,
          [field]: (field === 'startDate' || field === 'endDate') && value ? value.slice(0, 7) : value
        } : exp
      )
    } : prev);
  };

  // Helper functions for description points
  const handleAddDescriptionPoint = (expIndex: number, isNew = false) => {
    if (isNew) {
      setNewExperience(prev => ({
        ...prev,
        description: [...prev.description, '']
      }));
    } else {
      if (!profileData) return;
      setProfileData(prev => prev ? {
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === expIndex ? { ...exp, description: [...exp.description, ''] } : exp
        )
      } : prev);
    }
  };

  const handleRemoveDescriptionPoint = (expIndex: number, descIndex: number, isNew = false) => {
    if (isNew) {
      setNewExperience(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== descIndex)
      }));
    } else {
      if (!profileData) return;
      setProfileData(prev => prev ? {
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === expIndex ? { ...exp, description: exp.description.filter((_, j) => j !== descIndex) } : exp
        )
      } : prev);
    }
  };

  if (fetching) {
    return (
      <div className="profile-root">
        <Header onSignOut={onSignOut} />
        <main className="profile-main">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
            <div>Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }
  if (fetchError || !profileData) {
    return (
      <div className="profile-root">
        <Header onSignOut={onSignOut} />
        <main className="profile-main">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
            <div style={{ color: '#dc2626' }}>{fetchError || 'Profile not found.'}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <Header onSignOut={onSignOut} />
      <main className="profile-main">
        <div className="profile-main-inner fade-init fade-in">
          <section className="profile-header">
            <div className="profile-header-main">
              <div className="profile-header-left">
                <div className="profile-avatar">
                  {
                    profileData.name && profileData.name.trim().length > 0
                      ? profileData.name.trim().split(' ')[0][0].toUpperCase()
                      : '#'
                  }
                </div>
                <div>
                  {editMode ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileDataChange('name', e.target.value)}
                      className="profile-edit-input"
                    />
                  ) : (
                    <h2 className="profile-name">{profileData.name || <span className="profile-placeholder">No name provided</span>}</h2>
                  )}
                  <div className="profile-email">{profileData.email || <span className="profile-placeholder">No email provided</span>}</div>
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
                  <li>
                    <FiUser className="profile-detail-icon" />
                    {editMode ? (
                      <input
                        type="text"
                        value={profileData.age}
                        onChange={(e) => handleProfileDataChange('age', e.target.value)}
                        className="profile-edit-input"
                        placeholder="Age"
                      />
                    ) : (
                      profileData.age ? `${profileData.age} years old` : <span className="profile-placeholder">No age provided</span>
                    )}
                  </li>
                  <li>
                    <FiMapPin className="profile-detail-icon" />
                    {editMode ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleProfileDataChange('location', e.target.value)}
                        className="profile-edit-input"
                        placeholder="Location"
                      />
                    ) : (
                      profileData.location || <span className="profile-placeholder">No location provided</span>
                    )}
                  </li>
                  <li>
                    <FiBriefcase className="profile-detail-icon" />
                    {editMode ? (
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) => handleProfileDataChange('role', e.target.value)}
                        className="profile-edit-input"
                        placeholder="Role"
                      />
                    ) : (
                      profileData.role || <span className="profile-placeholder">No role provided</span>
                    )}
                  </li>
                  <li>
                    <FiLinkedin className="profile-detail-icon" />
                    {editMode ? (
                      <input
                        type="text"
                        value={profileData.linkedin}
                        onChange={(e) => handleProfileDataChange('linkedin', e.target.value)}
                        className="profile-edit-input"
                        placeholder="LinkedIn URL"
                      />
                    ) : (
                      profileData.linkedin ? (
                        <a href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`} className="profile-link" target="_blank" rel="noopener noreferrer">{profileData.linkedin}</a>
                      ) : <span className="profile-placeholder">No LinkedIn provided</span>
                    )}
                  </li>
                </ul>
              </div>
              <div className="profile-card">
                <h4>Skills</h4>
                <div className="profile-skills">
                  {profileData.skills.length === 0 && !editMode && (
                    <span className="profile-placeholder">No skills added</span>
                  )}
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                      {editMode && (
                        <button
                          className="skill-remove-btn"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                  {editMode && (
                    <div className="skill-add-container">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="skill-add-input"
                        placeholder="Add skill"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      />
                      <button
                        className="skill-add-btn"
                        onClick={handleAddSkill}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  )}
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
                {editMode ? (
                  <textarea
                    value={profileData.about}
                    onChange={(e) => handleProfileDataChange('about', e.target.value)}
                    className="profile-edit-textarea"
                    rows={6}
                  />
                ) : (
                  <p>{profileData.about ? profileData.about : <span className="profile-placeholder">No about information provided</span>}</p>
                )}
              </div>
              <div className="profile-card profile-experience">
                <h4>Experience</h4>
                {profileData.experience.length === 0 && !editMode && (
                  <div className="profile-placeholder" style={{ marginBottom: 12 }}>No experience added</div>
                )}
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="profile-experience-item">
                    {editMode ? (
                      <>
                        <div className="profile-experience-row">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(index, 'role', e.target.value)}
                            className="profile-edit-input"
                            placeholder="Role"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                            className="profile-edit-input"
                            placeholder="Company"
                          />
                        </div>
                        <div className="profile-experience-row">
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                            className="profile-edit-input profile-experience-date-input"
                            placeholder="MM/YYYY"
                          />
                          {!exp.currentlyWorking && (
                            <input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                              className="profile-edit-input profile-experience-date-input"
                              placeholder="MM/YYYY"
                            />
                          )}
                          <label className="profile-experience-checkbox-label" style={{ margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={exp.currentlyWorking}
                              onChange={(e) => handleUpdateExperience(index, 'currentlyWorking', e.target.checked)}
                              style={{ marginRight: 6 }}
                            />
                            Currently Working
                          </label>
                        </div>
                        {exp.description.map((desc, descIndex) => (
                          <div key={descIndex} className="profile-experience-description-row">
                            <input
                              type="text"
                              value={desc}
                              onChange={(e) => {
                                const newDesc = [...exp.description];
                                newDesc[descIndex] = e.target.value;
                                handleUpdateExperience(index, 'description', newDesc);
                              }}
                              className="profile-edit-input"
                              placeholder="Description point"
                            />
                            <button
                              className="description-remove-btn"
                              onClick={() => handleRemoveDescriptionPoint(index, descIndex)}
                              title="Remove description point"
                              disabled={exp.description.length === 1}
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          className="description-add-btn"
                          onClick={() => handleAddDescriptionPoint(index)}
                        >
                          <FiPlus style={{ marginRight: 4 }} /> Add Description Point
                        </button>
                        <button
                          className="experience-remove-btn-wide"
                          onClick={() => handleRemoveExperience(index)}
                          title="Remove experience"
                          style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FiX style={{ marginRight: 6 }} /> Remove Experience
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="profile-experience-header profile-experience-header-row">
                          <span className="profile-experience-role">{exp.role}</span>
                          <span className="profile-experience-dates profile-experience-dates-right">
                            {exp.startDate ?
                              (() => {
                                const d = new Date(exp.startDate + '-01');
                                return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
                              })() : ''}
                            {' - '}
                            {exp.currentlyWorking ? 'Present' : (
                              exp.endDate ? (() => {
                                const d = new Date(exp.endDate + '-01');
                                return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
                              })() : ''
                            )}
                          </span>
                        </div>
                        <div className="profile-experience-company">{exp.company}</div>
                        <ul>
                          {exp.description.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
                {editMode && (
                  <div className="experience-add-container">
                    <h5>Add New Experience</h5>
                    <div className="profile-experience-row">
                      <input
                        type="text"
                        value={newExperience.role}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, role: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="Role"
                      />
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                        className="profile-edit-input"
                        placeholder="Company"
                      />
                    </div>
                    <div className="profile-experience-row">
                      <input
                        type="month"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                        className="profile-edit-input profile-experience-date-input"
                        placeholder="MM/YYYY"
                      />
                      {!newExperience.currentlyWorking && (
                        <input
                          type="month"
                          value={newExperience.endDate}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                          className="profile-edit-input profile-experience-date-input"
                          placeholder="MM/YYYY"
                        />
                      )}
                      <label className="profile-experience-checkbox-label" style={{ margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={newExperience.currentlyWorking}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, currentlyWorking: e.target.checked, endDate: '' }))}
                          style={{ marginRight: 6 }}
                        />
                        Currently Working
                      </label>
                    </div>
                    {newExperience.description.map((desc, descIndex) => (
                      <div key={descIndex} className="profile-experience-description-row">
                        <input
                          type="text"
                          value={desc}
                          onChange={(e) => {
                            const newDesc = [...newExperience.description];
                            newDesc[descIndex] = e.target.value;
                            setNewExperience(prev => ({ ...prev, description: newDesc }));
                          }}
                          className="profile-edit-input"
                          placeholder="Description point"
                        />
                        <button
                          className="description-remove-btn"
                          onClick={() => handleRemoveDescriptionPoint(0, descIndex, true)}
                          title="Remove description point"
                          disabled={newExperience.description.length === 1}
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="description-add-btn"
                      onClick={() => handleAddDescriptionPoint(0, true)}
                    >
                      <FiPlus style={{ marginRight: 4 }} /> Add Description Point
                    </button>
                    <button
                      className="experience-add-btn"
                      onClick={handleAddExperience}
                      style={{ marginTop: 8 }}
                    >
                      <FiPlus style={{ marginRight: 4 }} /> Add Experience
                    </button>
                  </div>
                )}
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
