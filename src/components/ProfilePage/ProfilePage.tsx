import './ProfilePage.css';
import Header from '../Header/Header';
import { FiUser, FiMapPin, FiBriefcase, FiLinkedin, FiEye, FiDownload, FiUpload, FiFileText, FiEdit2, FiPlus, FiX, FiCamera } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';

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
  resume_url: string | null;
  profile_picture_url: string | null;
  resume_uploaded_at?: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // New state for editing
  const [newSkill, setNewSkill] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // New state for resume view
  const [isViewingResume, setIsViewingResume] = useState(false);
  const [resumeViewUrl, setResumeViewUrl] = useState<string | null>(null);

  const [originalProfilePicture, setOriginalProfilePicture] = useState<string | null>(null);
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(null);
  const { setProfilePicture } = useUser();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
          .select('age, location, role, linkedin, experience, resume_url, resume_uploaded_at, profile_picture_url, id, about, skills')
          .eq('id', userId)
          .single();
        if (profileError || !profile) {
          setFetchError('Failed to fetch profile.');
          setFetching(false);
          return;
        }
        setProfileData({
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          age: profile.age !== undefined && profile.age !== null ? String(profile.age) : '',
          location: profile.location || '',
          role: profile.role || '',
          linkedin: profile.linkedin || '',
          about: profile.about || '',
          skills: profile.skills || [],
          experience: profile.experience || [],
          resume_url: profile.resume_url || null,
          profile_picture_url: profile.profile_picture_url || null,
          resume_uploaded_at: profile.resume_uploaded_at || null
        });
        setOriginalProfilePicture(profile.profile_picture_url);
        setTempProfilePicture(null);
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

      // If there's a new profile picture, delete the old one
      if (tempProfilePicture && originalProfilePicture) {
        const oldFilePath = originalProfilePicture.split('/').pop();
        if (oldFilePath) {
          await supabase.storage
            .from('profile-avatars')
            .remove([`${user.id}/${oldFilePath}`]);
        }
      }

      // Update user metadata in Supabase Auth
      const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: profileData.name }
      });

      // Update profiles table (for profile info)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          age: profileData.age ? Number(profileData.age) : null,
          location: profileData.location,
          role: profileData.role || null,
          linkedin: profileData.linkedin || null,
          experience: profileData.experience || [],
          about: profileData.about || null,
          skills: profileData.skills || [],
          profile_picture_url: tempProfilePicture || originalProfilePicture || null
        })
        .eq('id', userId);

      if (userError || profileError) {
        setError('Failed to update profile. Please try again.');
        setIsLoading(false);
        return;
      }

      // Update the global profile picture state
      const newProfilePicture = tempProfilePicture || originalProfilePicture;
      setProfilePicture(newProfilePicture);
      setOriginalProfilePicture(newProfilePicture);
      setTempProfilePicture(null);
      setEditMode(false);
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (tempProfilePicture) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Delete the temporary profile picture
        const tempFilePath = tempProfilePicture.split('/').pop();
        if (tempFilePath) {
          await supabase.storage
            .from('profile-avatars')
            .remove([`${user.id}/${tempFilePath}`]);
        }
      } catch (err) {
        console.error('Error cleaning up temporary profile picture:', err);
      }
    }

    // Reset form data to original values
    if (profileData) {
      setProfileData({
        ...profileData,
        profile_picture_url: originalProfilePicture
      });
    }
    setTempProfilePicture(null);
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
      setProfileData(prev => prev ? {
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === expIndex ? { ...exp, description: exp.description.filter((_, j) => j !== descIndex) } : exp
        )
      } : prev);
    }
  };

  const handleViewResume = async () => {
    if (!profileData || !profileData.resume_url) return;
    
    try {
      // Get the file path from the URL
      const filePath = profileData.resume_url.split('/').pop();
      if (!filePath) return;

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create a signed URL that expires in 60 seconds
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(`${user.id}/${filePath}`, 60);

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        setError('Failed to view resume');
        return;
      }

      setResumeViewUrl(signedUrlData.signedUrl);
      setIsViewingResume(true);
    } catch (err) {
      console.error('Error viewing resume:', err);
      setError('Failed to view resume');
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    if (!profileData) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Generate a unique filename using timestamp
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `avatar_${timestamp}.${fileExtension}`;
      const filePath = `${user.id}/${uniqueFileName}`;
      
      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath);

      // Store the new URL as temporary
      setTempProfilePicture(urlData.publicUrl);
      setProfileData(prev => prev ? {
        ...prev,
        profile_picture_url: urlData.publicUrl
      } : prev);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError('Failed to upload profile picture');
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
          {error && (
            <div className="login-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <section className="profile-header">
            <div className="profile-header-main">
              <div className="profile-header-left">
                <div 
                  className="profile-avatar"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                  onClick={() => editMode && fileInputRef.current?.click()}
                  style={{ 
                    cursor: editMode ? 'pointer' : 'default',
                    background: (tempProfilePicture || profileData.profile_picture_url) ? 'none' : '#2563eb'
                  }}
                >
                  {(tempProfilePicture || profileData.profile_picture_url) ? (
                    <img 
                      src={(tempProfilePicture || profileData.profile_picture_url) || undefined} 
                      alt="Profile" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '20px'
                      }} 
                    />
                  ) : (
                    profileData.name && profileData.name.trim().length > 0
                      ? profileData.name.trim().split(' ')[0][0].toUpperCase()
                      : '#'
                  )}
                  {editMode && isHoveringAvatar && (
                    <div className="profile-avatar-overlay">
                      <FiCamera color="white" size={24} />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await handleProfilePictureUpload(file);
                    }}
                  />
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
                  <button 
                    className="profile-upload-btn"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    <FiUpload style={{ fontSize: '1.1em', marginRight: 4 }} />
                    Upload New
                  </button>
                  <input
                    type="file"
                    ref={resumeInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      try {
                        const { data: { user } } = await supabase.auth.getUser();
                        if (!user) return;
                        
                        const folderPath = `${user.id}/`;

                        // 1. List all existing resumes for the user
                        const { data: listData, error: listError } = await supabase
                          .storage
                          .from('resumes')
                          .list(folderPath);

                        if (listError) throw listError;

                        // 2. Delete all existing resumes for the user
                        if (listData && listData.length > 0) {
                          const filesToDelete = listData.map(fileObj => `${user.id}/${fileObj.name}`);
                          await supabase.storage.from('resumes').remove(filesToDelete);
                        }

                        // 3. Upload the new resume with the original file name
                        const filePath = `${user.id}/${file.name}`;
                        const { error: uploadError } = await supabase.storage
                          .from('resumes')
                          .upload(filePath, file);

                        if (uploadError) throw uploadError;

                        // 4. Get the public URL and update the profile
                        const { data: urlData } = supabase.storage
                          .from('resumes')
                          .getPublicUrl(filePath);

                        const now = new Date().toISOString();
                        await supabase
                          .from('profiles')
                          .update({
                            resume_url: urlData.publicUrl,
                            resume_uploaded_at: now
                          })
                          .eq('id', user.id);

                        setProfileData(prev => prev ? {
                          ...prev,
                          resume_url: urlData.publicUrl,
                          resume_uploaded_at: now
                        } : prev);
                      } catch (err) {
                        console.error('Error uploading resume:', err);
                        setError('Failed to upload resume');
                      }
                    }}
                  />
                </div>
                {profileData.resume_url ? (
                  <div className="profile-resume-file">
                    <FiFileText className="profile-resume-fileicon" />
                    <div>
                      <span className="profile-resume-filename">
                        {profileData.resume_url.split('/').pop()}
                      </span>
                      <span className="profile-resume-date">
                        Uploaded{profileData.resume_uploaded_at ? ` on ${new Date(profileData.resume_uploaded_at).toLocaleDateString()}` : ''}
                      </span>
                    </div>
                    <div className="profile-resume-actions">
                      <button 
                        className="profile-resume-view"
                        onClick={handleViewResume}
                      ><FiEye /></button>
                      <button 
                        className="profile-resume-download"
                        onClick={async () => {
                          if (profileData.resume_url) {
                            try {
                              // Get the file path from the URL
                              const filePath = profileData.resume_url.split('/').pop();
                              if (!filePath) return;

                              // Get the current user
                              const { data: { user } } = await supabase.auth.getUser();
                              if (!user) return;

                              // Create a signed URL that expires in 60 seconds
                              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                                .from('resumes')
                                .createSignedUrl(`${user.id}/${filePath}`, 60);

                              if (signedUrlError) {
                                console.error('Error creating signed URL:', signedUrlError);
                                setError('Failed to download resume');
                                return;
                              }

                              // Fetch the file
                              const response = await fetch(signedUrlData.signedUrl);
                              const blob = await response.blob();
                              
                              // Create a blob URL
                              const blobUrl = window.URL.createObjectURL(blob);
                              
                              // Create a temporary anchor element
                              const link = document.createElement('a');
                              link.style.display = 'none';
                              link.href = blobUrl;
                              link.download = filePath;
                              
                              // Append to body, click, and remove
                              document.body.appendChild(link);
                              link.click();
                              
                              // Clean up
                              window.URL.revokeObjectURL(blobUrl);
                              document.body.removeChild(link);
                            } catch (err) {
                              console.error('Error downloading resume:', err);
                              setError('Failed to download resume');
                            }
                          }
                        }}
                      ><FiDownload /></button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-placeholder">No resume uploaded</div>
                )}
              </div>

              {/* Resume View Modal */}
              {isViewingResume && resumeViewUrl && (
                <div className="resume-modal-overlay" onClick={() => setIsViewingResume(false)}>
                  <div className="resume-modal" onClick={e => e.stopPropagation()}>
                    <div className="resume-modal-header">
                      <h3>Resume Preview</h3>
                      <button 
                        className="resume-modal-close"
                        onClick={() => setIsViewingResume(false)}
                      >
                        <FiX size={24} />
                      </button>
                    </div>
                    <div className="resume-modal-content">
                      <iframe
                        src={resumeViewUrl}
                        title="Resume Preview"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              )}

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
                {profileData.experience.length === 0 && (
                  <div className="profile-placeholder" style={{ marginBottom: 12 }}>No experience added</div>
                )}
                {editMode && profileData.experience.length === 0 && (
                  <button
                    className="experience-add-btn"
                    onClick={() => handleProfileDataChange('experience', [...profileData.experience, {
                      role: '',
                      company: '',
                      startDate: '',
                      endDate: '',
                      currentlyWorking: false,
                      description: ['']
                    }])}
                    style={{ marginBottom: 16 }}
                  >
                    <FiPlus style={{ marginRight: 4 }} /> Add Experience
                  </button>
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
                        {index === profileData.experience.length - 1 && (
                          <hr className="profile-experience-divider" />
                        )}
                        {index === profileData.experience.length - 1 && (
                          <button
                            className="experience-add-btn"
                            onClick={() => handleProfileDataChange('experience', [...profileData.experience, {
                              role: '',
                              company: '',
                              startDate: '',
                              endDate: '',
                              currentlyWorking: false,
                              description: ['']
                            }])}
                            style={{ marginTop: 16 }}
                          >
                            <FiPlus style={{ marginRight: 4 }} /> Add Experience
                          </button>
                        )}
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
