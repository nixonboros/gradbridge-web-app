import { useState, useEffect } from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../lib/auth';

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
  { key: 'personal', label: 'Personal', icon: IconPersonal },
  { key: 'company', label: 'Company', icon: IconCompany },
];

function AccountTypeStep({ selectedType, onSelect, onNext, onBack }: any) {
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

function AccountDetailsStep({ accountType, onBack, onSubmit }: any) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add useEffect to clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // 5000ms = 5 seconds

      // Cleanup the timer if component unmounts or error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isCompany = accountType === 'company';

  // Button enabled if all fields are non-empty
  const isFilled =
    form.fullname.trim() &&
    form.email.trim() &&
    form.password &&
    form.confirmPassword;

  // Validation
  const isEmailValid = /^.+@.+$/.test(form.email); // Only require @ and at least one char after
  const isPasswordValid = form.password.length >= 8;
  const doPasswordsMatch = form.password === form.confirmPassword;

  // Add a state to track if the field has been touched
  const [fullnameTouched, setFullnameTouched] = useState(false);
  const [fullnameError, setFullnameError] = useState<string | null>(null);

  // Validation function for full name
  const validateFullName = (name: string) => {
    // If the field is empty, return null (no error)
    if (!name.trim()) {
      return null;
    }
    
    if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
    if (name.length > 50) {
      return 'Name must be less than 50 characters long';
    }
    if (!name.includes(' ')) {
      return 'Please enter your full name (first and last name)';
    }
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return 'Please enter both your first and last name';
    }
    if (nameParts.some(part => part.length < 2)) {
      return 'Each name part must be at least 2 characters long';
    }
    return null;
  };

  // Update the form state with validation
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(f => ({ ...f, fullname: value }));
    // Only show validation if the field has been touched
    if (fullnameTouched) {
      setFullnameError(validateFullName(value));
    }
  };

  // Handle blur event to mark field as touched
  const handleFullNameBlur = () => {
    setFullnameTouched(true);
    setFullnameError(validateFullName(form.fullname));
  };

  // Update the existing validation logic
  const isFullNameValid = !fullnameError && form.fullname.trim().length > 0;

  // Error states
  const emailError = form.email && !isEmailValid;
  const passwordError = form.password && !isPasswordValid;
  const confirmError = form.password && form.confirmPassword && !doPasswordsMatch;

  // Update the isValid check to include full name validation
  const isValid = isFilled && isFullNameValid && isEmailValid && isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp({
        accountType,
        fullName: form.fullname,
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      // If successful, redirect to login
      navigate('/login');
    } catch (err) {
      if (err instanceof Error) {
        // Make error messages more user-friendly
        const errorMessage = err.message;
        
        // Handle common Supabase errors
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
          // For any other error, show a generic but helpful message
          setError('Unable to create account. Please try again.');
        }
      } else if (typeof err === 'object' && err !== null) {
        // Handle Supabase error objects
        const errorObj = err as any;
        if (errorObj.code === '23505') { // Unique violation
          setError('This email is already registered. Please use a different email or try logging in.');
        } else if (errorObj.code === '23503') { // Foreign key violation
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
          <label className="signup-input-label" htmlFor="signup-email">{isCompany ? 'Work Email Address' : 'Email Address'}</label>
          <input
            id="signup-email"
            type="text"
            placeholder={isCompany ? 'Work Email Address' : 'Email Address'}
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={emailError ? { borderColor: '#ef4444' } : {}}
            autoComplete="email"
          />
          {form.email && emailError && (
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
            style={passwordError ? { borderColor: '#ef4444' } : {}}
            autoComplete="new-password"
          />
          {form.password && passwordError && (
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
            style={confirmError ? { borderColor: '#ef4444' } : {}}
            autoComplete="new-password"
          />
          {form.confirmPassword && confirmError && (
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

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('');
  const [fadeIn] = useState(true);
  const navigate = useNavigate();

  const handleTypeSelect = (type: string) => setAccountType(type);
  const handleTypeNext = () => setStep(2);
  const handleBackToLogin = () => navigate('/login');
  const handleBackToType = () => setStep(1);
  const handleSubmit = (form: any) => {
    // Placeholder for submit logic
    alert('Sign up submitted!');
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
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage; 