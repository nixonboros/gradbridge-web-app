import { useState } from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { createUserAndProfile } from '../../lib/auth';
import { FiPlus, FiX } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

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
function AccountDetailsStep({ accountType, onBack, onNext }: {
  accountType: AccountType;
  onBack: () => void;
  onNext: (data: FormData) => void;
}) {
  const [form, setForm] = useState<FormData>({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [fullnameTouched, setFullnameTouched] = useState(false);
  const [fullnameError, setFullnameError] = useState<string | null>(null);

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

  const isEmailValid = /^.+@.+$/.test(form.email);
  const isPasswordValid = form.password.length >= 8;
  const doPasswordsMatch = form.password === form.confirmPassword;
  const isFullNameValid = !fullnameError && form.fullname.trim().length > 0;
  const isFilled = form.fullname.trim() && form.email.trim() && form.password && form.confirmPassword;
  const isValid = isFilled && isFullNameValid && isEmailValid && isPasswordValid && doPasswordsMatch;

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

    try {
      // Check if email exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', form.email)
        .single();

      if (existingUser) {
        setError('This email is already registered. Please use a different email or try logging in.');
        return;
      }

      // If email is available, proceed to next step
      onNext(form);
    } catch (error) {
      setError('An error occurred. Please try again.');
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
            disabled={!isValid}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
}

// Profile Details Step
function ProfileDetailsStep({ onBack, onComplete }: {
  accountType: AccountType;
  onBack: () => void;
  onComplete: (data: ProfileData) => void;
  accountData: FormData;
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

  // Only errors for required fields
  const [errors, setErrors] = useState<{ age?: string; location?: string }>({});
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

  // Only validate required fields
  const validateForm = () => {
    const newErrors: { age?: string; location?: string } = {};
    if (!profileData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(profileData.age)) || Number(profileData.age) < 16 || Number(profileData.age) > 100) {
      newErrors.age = 'Please enter a valid age between 16 and 100';
    }
    if (!profileData.location) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onComplete(profileData);
    } catch (error) {
      // handle error if needed
    } finally {
      setIsLoading(false);
    }
  };

  // Validation for required fields
  const isAgeValid = profileData.age && !isNaN(Number(profileData.age)) && Number(profileData.age) >= 16 && Number(profileData.age) <= 100;
  const isLocationValid = profileData.location && profileData.location.trim().length > 0;
  const isProfileValid = isAgeValid && isLocationValid;

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
              onChange={(e) => {
                setProfileData(prev => ({ ...prev, age: e.target.value }));
                if (!e.target.value || isNaN(Number(e.target.value)) || Number(e.target.value) < 16 || Number(e.target.value) > 100) {
                  setErrors(prev => ({ ...prev, age: 'Please enter a valid age between 16 and 100' }));
                } else {
                  setErrors(prev => { const { age, ...rest } = prev; return rest; });
                }
              }}
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
              onChange={(e) => {
                setProfileData(prev => ({ ...prev, location: e.target.value }));
                if (!e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, location: 'Location is required' }));
                } else {
                  setErrors(prev => { const { location, ...rest } = prev; return rest; });
                }
              }}
              style={errors.location ? { borderColor: '#ef4444' } : {}}
            />
            {errors.location && <div className="signup-helper-text">{errors.location}</div>}
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label" htmlFor="signup-role">Role/Job Title (Optional)</label>
            <input
              id="signup-role"
              type="text"
              placeholder="e.g. Software Engineer"
              value={profileData.role}
              onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
            />
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label" htmlFor="signup-linkedin">LinkedIn Profile URL (Optional)</label>
            <input
              id="signup-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={profileData.linkedin}
              onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
            />
          </div>

          <div className="signup-form-group">
            <label className="signup-input-label">Work Experience (Optional)</label>
            {profileData.experience.map((exp, index) => (
              <div key={index} className="experience-form-group">
                <div className="profile-experience-row">
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  />
                </div>
                <div className="profile-experience-row">
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  />
                  {!exp.currentlyWorking && (
                    <input
                      type="month"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
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
          disabled={!isProfileValid || isLoading}
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
  const navigate = useNavigate();

  const handleTypeSelect = (type: AccountType) => setAccountType(type);
  const handleTypeNext = () => setStep(2);
  const handleBackToLogin = () => navigate('/login');
  const handleBackToType = () => setStep(1);
  const handleAccountDetailsNext = (data: FormData) => {
    setAccountData(data);
    setStep(3);
  };

  const handleProfileComplete = async (profileData: ProfileData) => {
    if (!accountData) return;
    if (accountType !== 'personal' && accountType !== 'company') {
      alert('Please select an account type.');
      return;
    }
    // Filter out empty experience entries
    const filteredExperience = profileData.experience.filter(exp =>
      exp.role.trim() || exp.company.trim() || exp.startDate.trim() || exp.endDate.trim() || exp.description.some(d => d.trim())
    );
    const cleanedProfileData = { ...profileData, experience: filteredExperience };
    try {
      const { error } = await createUserAndProfile({
        accountType,
        fullName: accountData.fullname,
        email: accountData.email,
        password: accountData.password,
        profile: cleanedProfileData,
      });
      if (error) {
        const pgError = error as { code?: string; message?: string; details?: string };
        console.error('Signup error:', pgError);
        
        if (pgError.code === '23505') { // Unique violation
          throw new Error('This email is already registered. Please use a different email or try logging in.');
        } else if (pgError.code === '23503') { // Foreign key violation
          throw new Error('Error creating profile. Please try again. (Foreign key violation)');
        } else if (pgError.details) {
          throw new Error(`Error: ${pgError.details}`);
        } else {
          throw new Error(pgError.message || 'Failed to create account');
        }
      }
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert('Error creating account: ' + errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
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
            onNext={handleAccountDetailsNext}
          />
        )}
        {step === 3 && accountData && (
          <ProfileDetailsStep
            accountType={accountType}
            onBack={() => setStep(2)}
            onComplete={handleProfileComplete}
            accountData={accountData}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage; 