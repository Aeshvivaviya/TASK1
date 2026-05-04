import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiBriefcase,
  FiLink, FiSend, FiAlertCircle,
} from 'react-icons/fi';
import SkillsInput from './SkillsInput';
import PhoneInput from './PhoneInput';
import LoadingSpinner from './LoadingSpinner';
import { submitApplication } from '../services/api';

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Select experience level' },
  { value: '0-1 years', label: '0–1 Years (Fresher)' },
  { value: '1-2 years', label: '1–2 Years (Junior)' },
  { value: '2-4 years', label: '2–4 Years (Mid-Level)' },
  { value: '4-6 years', label: '4–6 Years (Senior)' },
  { value: '6+ years', label: '6+ Years (Expert)' },
];

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  skills: [],
  experience: '',
  portfolioLink: '',
};

// ─── FormField OUTSIDE CareerForm ─────────────────────────────────────────────
// IMPORTANT: Must be defined outside to prevent remount on every keystroke
// If defined inside, React treats it as a new component each render → focus lost
const FormField = ({ label, name, icon: Icon, required, children, hint, error }) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="label">
      {Icon && <Icon className="inline mr-1.5 text-slate-400" size={14} />}
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    {error && (
      <p className="error-text">
        <FiAlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);
// ──────────────────────────────────────────────────────────────────────────────

const CareerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Validation ---
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/[\s\-().+]/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    if (formData.portfolioLink && !/^https?:\/\/.+/.test(formData.portfolioLink)) {
      newErrors.portfolioLink = 'URL must start with http:// or https://';
    }

    return newErrors;
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (fullPhone) => {
    setFormData((prev) => ({ ...prev, phone: fullPhone }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({ ...prev, skills }));
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your application...');

    try {
      const response = await submitApplication(formData);

      toast.dismiss(loadingToast);
      toast.success('Application submitted successfully!');

      navigate('/success', {
        state: {
          name: response.data.name,
          taskTitle: response.data.taskTitle,
          emailSent: response.data.emailSent,
        },
      });
    } catch (error) {
      toast.dismiss(loadingToast);

      const errorData = error.response?.data;

      if (errorData?.errors) {
        const serverErrors = {};
        errorData.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
        toast.error('Please fix the highlighted errors');
      } else if (error.response?.status === 409) {
        setErrors({ email: 'This email has already been used to apply' });
        toast.error('An application with this email already exists');
      } else {
        toast.error(error.userMessage || 'Submission failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">

      {/* Row 1: Full Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Full Name" name="fullName" icon={FiUser} required error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`input-field ${errors.fullName ? 'input-error' : ''}`}
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email Address" name="email" icon={FiMail} required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            autoComplete="email"
          />
        </FormField>
      </div>

      {/* Row 2: Phone + Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Phone Number" name="phone" icon={FiPhone} required error={errors.phone}>
          <PhoneInput
            value={formData.phone}
            onChange={handlePhoneChange}
            error={errors.phone}
          />
        </FormField>

        <FormField label="Experience Level" name="experience" icon={FiBriefcase} required error={errors.experience}>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`input-field ${errors.experience ? 'input-error' : ''}`}
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Skills */}
      <FormField
        label="Skills"
        name="skills"
        required
        hint="Type a skill and press Enter, or click suggestions below"
        error={errors.skills}
      >
        <SkillsInput
          value={formData.skills}
          onChange={handleSkillsChange}
          error={errors.skills}
        />
      </FormField>

      {/* Portfolio Link */}
      <FormField
        label="Portfolio / GitHub Link"
        name="portfolioLink"
        icon={FiLink}
        hint="Optional — helps us tailor your task better"
        error={errors.portfolioLink}
      >
        <input
          id="portfolioLink"
          name="portfolioLink"
          type="url"
          value={formData.portfolioLink}
          onChange={handleChange}
          placeholder="https://github.com/yourusername"
          className={`input-field ${errors.portfolioLink ? 'input-error' : ''}`}
          autoComplete="url"
        />
      </FormField>

      {/* Consent Note */}
      <p className="text-xs text-slate-500 leading-relaxed">
        By submitting, you agree that we may process your data to generate a personalized technical task
        and send it to your email. We respect your privacy.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Processing your application...</span>
          </>
        ) : (
          <>
            <FiSend size={16} />
            <span>Submit Application</span>
          </>
        )}
      </button>

      {isSubmitting && (
        <p className="text-center text-xs text-slate-500 animate-pulse">
          🤖 AI is analyzing your profile and generating a personalized task...
        </p>
      )}
    </form>
  );
};

export default CareerForm;
