import { useState, useEffect } from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../lib/auth';

// Types
type AccountType = 'personal' | 'company' | '';

interface FormData {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
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
function AccountDetailsStep({ accountType, onBack }: {
  accountType: AccountType;
  onBack: () => void;
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
        fullName: form.fullname,
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      navigate('/login');
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

// Main Component
const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>('');
  const [fadeIn] = useState(true);
  const navigate = useNavigate();

  const handleTypeSelect = (type: AccountType) => setAccountType(type);
  const handleTypeNext = () => setStep(2);
  const handleBackToLogin = () => navigate('/login');
  const handleBackToType = () => setStep(1);

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
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage; 