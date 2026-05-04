import React, { useState } from 'react';
import { FiMail, FiPhone, FiBriefcase, FiLink, FiChevronDown, FiChevronUp, FiCheck, FiSend } from 'react-icons/fi';
import { updateStatus, resendEmail } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  task_assigned: { label: 'Task Assigned', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  under_review: { label: 'Under Review', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  accepted: { label: 'Accepted', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

/**
 * Candidate card for admin panel
 */
const CandidateCard = ({ candidate, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [emailSent, setEmailSent] = useState(candidate.emailSent);
  const [resending, setResending] = useState(false);

  const statusInfo = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.pending;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateStatus(candidate._id, newStatus);
      onStatusUpdate(candidate._id, newStatus);
      toast.success(`Status updated to "${STATUS_CONFIG[newStatus]?.label}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendEmail(candidate._id);
      setEmailSent(true);
      toast.success('Email resent successfully!');
    } catch (err) {
      toast.error(err.userMessage || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  return (
    <div className="card p-5 hover:border-slate-700 transition-all duration-200 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {candidate.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white">{candidate.fullName}</h3>
            <p className="text-slate-400 text-sm">{candidate.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <FiPhone size={13} /> {candidate.phone}
        </span>
        <span className="flex items-center gap-1.5">
          <FiBriefcase size={13} /> {candidate.experience}
        </span>
        {candidate.portfolioLink && (
          <a
            href={candidate.portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors"
          >
            <FiLink size={13} /> Portfolio
          </a>
        )}
        <span className="ml-auto text-xs text-slate-500">{formatDate(candidate.createdAt)}</span>
      </div>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {candidate.skills.map((skill) => (
          <span key={skill} className="skill-tag text-xs">
            {skill}
          </span>
        ))}
      </div>

      {/* Expanded: Task + Status Update */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
          {/* Generated Task */}
          {candidate.generatedTask?.title && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">🤖 AI Generated Task</h4>
                {candidate.generatedTask.difficulty && (
                  <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                    {candidate.generatedTask.difficulty}
                  </span>
                )}
              </div>
              <p className="text-primary-400 font-medium text-sm mb-2">{candidate.generatedTask.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                {candidate.generatedTask.description}
              </p>
              {candidate.generatedTask.requirements?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {candidate.generatedTask.requirements.slice(0, 3).map((req, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <FiCheck size={11} className="text-green-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Email Status */}
          <div className="flex items-center gap-3 text-xs">
            <span className={`flex items-center gap-1 ${emailSent ? 'text-green-400' : 'text-red-400'}`}>
              <FiMail size={12} />
              {emailSent ? 'Email sent' : 'Email not sent'}
            </span>
            {candidate.generatedTask?.title && (
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg border border-primary-500/30 transition-colors disabled:opacity-50"
              >
                <FiSend size={11} className={resending ? 'animate-pulse' : ''} />
                {resending ? 'Sending...' : 'Resend Email'}
              </button>
            )}
          </div>

          {/* Status Update */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Update Status:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  disabled={updating || candidate.status === key}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    candidate.status === key
                      ? `${config.color} cursor-default`
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
