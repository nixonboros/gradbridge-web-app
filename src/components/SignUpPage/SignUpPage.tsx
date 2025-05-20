import { useState } from 'react';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';

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
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
  const isFullNameValid = !!form.fullname.trim();

  // Error states
  const fullnameError = form.fullname && !isFullNameValid;
  const emailError = form.email && !isEmailValid;
  const passwordError = form.password && !isPasswordValid;
  const confirmError = form.password && form.confirmPassword && !doPasswordsMatch;

  // Only allow submit if all fields are filled and valid
  const isValid = isFilled && isFullNameValid && isEmailValid && isPasswordValid && doPasswordsMatch;

  return (
    <form className="signup-step-details" onSubmit={e => { e.preventDefault(); if (isValid) onSubmit(form); }}>
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
            onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))}
            style={fullnameError ? { borderColor: '#ef4444' } : {}}
          />
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
        <div className="signup-btn-row">
          <button type="submit" className="signup-next-btn" disabled={!isFilled}>
            Create Account
          </button>
          {/* TODO: Add account creation logic here */}
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