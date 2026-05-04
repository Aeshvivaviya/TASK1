import React, { useState, useRef } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

// Predefined popular skills for quick selection
const POPULAR_SKILLS = [
  'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Express.js', 'Python', 'Django', 'FastAPI',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
  'REST API', 'GraphQL', 'Docker', 'AWS', 'Git',
  'Java', 'Spring Boot', 'PHP', 'Laravel', 'Next.js',
];

/**
 * Skills input component with tag-based UI and quick-add suggestions
 * @param {Array} value - Current skills array
 * @param {Function} onChange - Callback when skills change
 * @param {string} error - Validation error message
 */
const SkillsInput = ({ value = [], onChange, error }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filteredSuggestions = POPULAR_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(skill)
  );

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !value.includes(trimmed) && value.length < 15) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    onChange(value.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      {/* Tags + Input Container */}
      <div
        className={`min-h-[48px] w-full bg-slate-800/60 border rounded-xl px-3 py-2 flex flex-wrap gap-2 cursor-text transition-all duration-200 ${
          error
            ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500'
            : 'border-slate-700 hover:border-slate-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Skill Tags */}
        {value.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="hover:text-red-400 transition-colors ml-0.5"
              aria-label={`Remove ${skill}`}
            >
              <FiX size={12} />
            </button>
          </span>
        ))}

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? 'Type a skill and press Enter...' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-slate-100 placeholder-slate-500 text-sm outline-none py-0.5"
          disabled={value.length >= 15}
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          <div className="max-h-48 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((skill) => (
              <button
                key={skill}
                type="button"
                onMouseDown={() => addSkill(skill)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
              >
                <FiPlus size={14} className="text-primary-400" />
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Skills Quick-Add */}
      {value.length === 0 && !showSuggestions && (
        <div className="mt-2">
          <p className="text-xs text-slate-500 mb-2">Popular skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 px-2.5 py-1 rounded-full transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Counter */}
      {value.length > 0 && (
        <p className="text-xs text-slate-500 mt-1.5 text-right">{value.length}/15 skills</p>
      )}
    </div>
  );
};

export default SkillsInput;
