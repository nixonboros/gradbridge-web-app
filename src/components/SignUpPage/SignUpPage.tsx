import { useState, useEffect } from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../lib/auth';
import { FiPlus, FiX } from 'react-icons/fi';

// Types
type AccountType = 'personal' | 'company' | '';

interface FormData {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ProfileData {
  age: string;
  location: string;
  role: string;
  linkedin: string;
  experience: {
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    description: string[];
  }[];
  resume?: File | null;
  profilePicture?: File | null;
}

// Icons
function IconPersonal({ selected }: { selected: boolean }) {
  return (
    <div className={`icon-user${selected ? ' selected' : ''}`}>
      <div className="icon-user-head" />
      <div className="icon-user-body" />
    </div>
  );
}

function IconCompany({ selected }: { selected: boolean }) {
  return (
    <div className={`icon-briefcase${selected ? ' selected' : ''}`}>
      <div className="icon-briefcase-handle" />
      <div className="icon-briefcase-body" />
    </div>
  );
}

const ACCOUNT_TYPES = [
  { key: 'personal' as AccountType, label: 'Personal', icon: IconPersonal },
  { key: 'company' as AccountType, label: 'Company', icon: IconCompany },
];

// Account Type Selection Step
function AccountTypeStep({ selectedType, onSelect, onNext, onBack }: {
  selectedType: AccountType;
  onSelect: (type: AccountType) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="signup-step">
      <button className="signup-back-top-btn" onClick={onBack} type="button" aria-label="Back to login">
        <span className="chevron-left">&#8592;</span>
      </button>
      <h2 className="signup-title">Are you using GradBridge for...</h2>
      <div className="signup-type-options">
        {ACCOUNT_TYPES.map(type => {
          const Icon = type.icon;
          return (
            <button
              key={type.key}
              className={`signup-type-btn${selectedType === type.key ? ' selected' : ''}`}
              onClick={() => onSelect(selectedType === type.key ? '' : type.key)}
              type="button"
            >
              <span className="signup-type-icon">
                <Icon selected={selectedType === type.key} />
              </span>
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>
      <div className="signup-form">
        <div className="signup-btn-row">
          <button
            className="signup-next-btn"
            onClick={onNext}
            disabled={!selectedType}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Account Details Step
function AccountDetailsStep({ accountType, onBack, onComplete }: {
  accountType: AccountType;
  onBack: () => void;
  onComplete: (data: FormData) => void;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullnameTouched, setFullnameTouched] = useState(false);
  const [fullnameError, setFullnameError] = useState<string | null>(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Validation functions
  const validateFullName = (name: string): string | null => {
    if (!name.trim()) return null;
    if (name.length < 3) return 'Name must be at least 3 characters long';
    if (name.length > 50) return 'Name must be less than 50 characters long';
    if (!name.includes(' ')) return 'Please enter your full name (first and last name)';
    
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) return 'Please enter both your first and last name';
    if (nameParts.some(part => part.length < 2)) return 'Each name part must be at least 2 characters long';
    
    return null;
  };

  // Form validation states
  const isEmailValid = /^.+@.+$/.test(form.email);
  const isPasswordValid = form.password.length >= 8;
  const doPasswordsMatch = form.password === form.confirmPassword;
  const isFullNameValid = !fullnameError && form.fullname.trim().length > 0;
  const isFilled = form.fullname.trim() && form.email.trim() && form.password && form.confirmPassword;
  const isValid = isFilled && isFullNameValid && isEmailValid && isPasswordValid && doPasswordsMatch;

  // Event handlers
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(f => ({ ...f, fullname: value }));
    if (fullnameTouched) {
      setFullnameError(validateFullName(value));
    }
  };

  const handleFullNameBlur = () => {
    setFullnameTouched(true);
    setFullnameError(validateFullName(form.fullname));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !accountType) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp({
        accountType: accountType as 'personal' | 'company',
        fullName: form.fullname
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      onComplete(form);
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        if (errorMessage.includes('duplicate key')) {
          setError('This email is already registered. Please use a different email or try logging in.');
        } else if (errorMessage.includes('network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (errorMessage.includes('timeout')) {
          setError('Request timed out. Please try again.');
        } else if (errorMessage.includes('permission denied')) {
          setError('Unable to create account. Please try again later.');
        } else if (errorMessage.includes('invalid input')) {
          setError('Please check your information and try again.');
        } else {
          setError('Unable to create account. Please try again.');
        }
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as any;
        if (errorObj.code === '23505') {
          setError('This email is already registered. Please use a different email or try logging in.');
        } else if (errorObj.code === '23503') {
          setError('Invalid account type. Please try again.');
        } else {
          setError('Unable to create account. Please try again.');
        }
      } else {
        setError('Unable to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="signup-step-details" onSubmit={handleSubmit}>
      <button className="signup-back-top-btn" onClick={onBack} type="button" aria-label="Back to type select">
        <span className="chevron-left">&#8592;</span>
      </button>
      <h2 className="signup-title">Sign up</h2>
      <div className="signup-form">
        <div className="signup-form-group">
          <label className="signup-input-label" htmlFor="signup-fullname">Full Name</label>
          <input
            id="signup-fullname"
            type="text"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleFullNameChange}
            onBlur={handleFullNameBlur}
            style={fullnameError ? { borderColor: '#ef4444' } : {}}
          />
          {fullnameTouched && fullnameError && (
            <div className="signup-helper-text">{fullnameError}</div>
          )}
        </div>
        <div className="signup-form-group">
          <label className="signup-input-label" htmlFor="signup-email">
            {accountType === 'company' ? 'Work Email Address' : 'Email Address'}
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder={accountType === 'company' ? 'Work Email Address' : 'Email Address'}
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={!isEmailValid && form.email ? { borderColor: '#ef4444' } : {}}
            autoComplete="email"
          />
          {form.email && !isEmailValid && (
            <div className="signup-helper-text">Must be a valid email address (e.g. user@example.com)</div>
          )}
        </div>
        <div className="signup-form-group">
          <label className="signup-input-label" htmlFor="signup-password">Create a Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Create a Password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={!isPasswordValid && form.password ? { borderColor: '#ef4444' } : {}}
            autoComplete="new-password"
          />
          {form.password && !isPasswordValid && (
            <div className="signup-helper-text">Must be at least 8 characters</div>
          )}
        </div>
        <div className="signup-form-group">
          <label className="signup-input-label" htmlFor="signup-confirm">Confirm Password</label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            style={!doPasswordsMatch && form.confirmPassword ? { borderColor: '#ef4444' } : {}}
            autoComplete="new-password"
          />
          {form.confirmPassword && !doPasswordsMatch && (
            <div className="signup-helper-text">Passwords must match</div>
          )}
        </div>
        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}
        <div className="signup-btn-row">
          <button 
            type="submit" 
            className="signup-next-btn" 
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </form>
  );
}

// Profile Details Step
function ProfileDetailsStep({ accountType, onBack, onComplete }: {
  accountType: AccountType;
  onBack: () => void;
  onComplete: (data: ProfileData) => void;
}) {
  const [profileData, setProfileData] = useState<ProfileData>({
    age: '',
    location: '',
    role: '',
    linkedin: '',
    experience: [
      {
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: ['']
      }
    ],
    resume: null,
    profilePicture: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- Experience Handlers ---
  const handleExperienceChange = (index: number, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: '',
          company: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: ['']
        }
      ]
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleDescriptionChange = (expIndex: number, descIndex: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? { ...exp, description: exp.description.map((desc, j) => (j === descIndex ? value : desc)) }
          : exp
      )
    }));
  };

  const handleAddDescriptionPoint = (expIndex: number) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? { ...exp, description: [...exp.description, ''] }
          : exp
      )
    }));
  };

  const handleRemoveDescriptionPoint = (expIndex: number, descIndex: number) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? { ...exp, description: exp.description.length > 1 ? exp.description.filter((_, j) => j !== descIndex) : exp.description }
          : exp
      )
    }));
  };

  const handleFileChange = (field: 'resume' | 'profilePicture', file: File | null) => {
    setProfileData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProfileData, string>> = {};
    
    if (!profileData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(profileData.age)) || Number(profileData.age) < 16 || Number(profileData.age) > 100) {
      newErrors.age = 'Please enter a valid age between 16 and 100';
    }

    if (!profileData.location) {
      newErrors.location = 'Location is required';
    }

    if (profileData.linkedin && !profileData.linkedin.includes('linkedin.com/')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    // Validate experience
    if (profileData.experience.length > 0) {
      const exp = profileData.experience[0];
      if (!exp.role) newErrors.experience = 'Role is required';
      if (!exp.company) newErrors.experience = 'Company is required';
      if (!exp.startDate) newErrors.experience = 'Start date is required';
      if (!exp.currentlyWorking && !exp.endDate) newErrors.experience = 'End date is required when not currently working';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Here you would typically upload the files and save the profile data
      // For now, we'll just pass the data to the parent component
      onComplete(profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="signup-step-details" onSubmit={handleSubmit}>
      <button className="signup-back-top-btn" onClick={onBack} type="button" aria-label="Back to account details">
        <span className="chevron-left">&#8592;</span>
      </button>
      <h2 className="signup-title">Complete Your Profile</h2>
      <div className="profile-details-scrollable">
        <div className="signup-form">
          <div className="signup-form-group">
            <label className="signup-input-label" htmlFor="signup-age">Age *</label>
            <input
              id="signup-age"
              type="number"
              placeholder="Enter your age"
              value={profileData.age}
              onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
              style={errors.age ? { borderColor: '#ef4444' } : {}}
            />
            {errors.age && <div className="signup-helper-text">{errors.age}</div>}
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label" htmlFor="signup-location">Location *</label>
            <input
              id="signup-location"
              type="text"
              placeholder="City, Country"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              style={errors.location ? { borderColor: '#ef4444' } : {}}
            />
            {errors.location && <div className="signup-helper-text">{errors.location}</div>}
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label" htmlFor="signup-role">Role/Job Title</label>
            <input
              id="signup-role"
              type="text"
              placeholder="e.g. Software Engineer"
              value={profileData.role}
              onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
            />
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label" htmlFor="signup-linkedin">LinkedIn Profile URL</label>
            <input
              id="signup-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={profileData.linkedin}
              onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
              style={errors.linkedin ? { borderColor: '#ef4444' } : {}}
            />
            {errors.linkedin && <div className="signup-helper-text">{errors.linkedin}</div>}
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label">Work Experience *</label>
            {profileData.experience.map((exp, index) => (
              <div key={index} className="experience-form-group">
                <div className="profile-experience-row">
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    style={errors.experience ? { borderColor: '#ef4444' } : {}}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    style={errors.experience ? { borderColor: '#ef4444' } : {}}
                  />
                </div>
                <div className="profile-experience-row">
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    style={errors.experience ? { borderColor: '#ef4444' } : {}}
                  />
                  {!exp.currentlyWorking && (
                    <input
                      type="month"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                      style={errors.experience ? { borderColor: '#ef4444' } : {}}
                    />
                  )}
                </div>
                <div className="experience-checkbox-row">
                  <label className="profile-experience-checkbox-label">
                    <input
                      type="checkbox"
                      checked={exp.currentlyWorking}
                      onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)}
                    />
                    Currently Working
                  </label>
                </div>
                {exp.description.map((desc, descIndex) => (
                  <div key={descIndex} className="profile-experience-description-row">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => handleDescriptionChange(index, descIndex, e.target.value)}
                      className="profile-edit-input"
                      placeholder="Description point"
                    />
                    <button
                      className="description-remove-btn"
                      type="button"
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
                  type="button"
                  onClick={() => handleAddDescriptionPoint(index)}
                >
                  <FiPlus style={{ marginRight: 4 }} /> Add Description Point
                </button>
                {profileData.experience.length > 1 && (
                  <button
                    className="experience-remove-btn-wide"
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    title="Remove experience"
                    style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FiX style={{ marginRight: 6 }} /> Remove Experience
                  </button>
                )}
              </div>
            ))}
            <button
              className="experience-add-btn"
              type="button"
              onClick={handleAddExperience}
              style={{ marginTop: 8 }}
            >
              <FiPlus style={{ marginRight: 4 }} /> Add Experience
            </button>
            {errors.experience && <div className="signup-helper-text">{errors.experience}</div>}
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label">Resume/CV (Optional)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
            />
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label">Profile Picture (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('profilePicture', e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </div>
      <div className="signup-btn-row">
        <button 
          type="submit" 
          className="signup-next-btn" 
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
        </button>
      </div>
    </form>
  );
}

// Main Component
const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>('');
  const [accountData, setAccountData] = useState<FormData | null>(null);
  const [fadeIn] = useState(true);
  const navigate = useNavigate();

  const handleTypeSelect = (type: AccountType) => setAccountType(type);
  const handleTypeNext = () => setStep(2);
  const handleBackToLogin = () => navigate('/login');
  const handleBackToType = () => setStep(1);
  const handleAccountDetailsComplete = (data: FormData) => {
    setAccountData(data);
    setStep(3);
  };
  const handleProfileComplete = async (profileData: ProfileData) => {
    // Here you would typically combine accountData and profileData
    // and send them to your backend
    try {
      const { error } = await signUp({
        accountType: accountType as 'personal' | 'company',
        fullName: accountData?.fullname || '',
        email: accountData?.email || '',
        password: accountData?.password || '',
      });

      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error('Error during signup:', err);
    }
  };

  return (
    <div className="signup-container">
      <div className={`signup-card fade-init${fadeIn ? ' fade-in' : ''}`}>
        {step === 1 && (
          <AccountTypeStep
            selectedType={accountType}
            onSelect={handleTypeSelect}
            onNext={handleTypeNext}
            onBack={handleBackToLogin}
          />
        )}
        {step === 2 && (
          <AccountDetailsStep
            accountType={accountType}
            onBack={handleBackToType}
            onComplete={handleAccountDetailsComplete}
          />
        )}
        {step === 3 && (
          <ProfileDetailsStep
            accountType={accountType}
            onBack={() => setStep(2)}
            onComplete={handleProfileComplete}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage; 