import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiMail, FiArrowLeft, FiCpu, FiClock } from 'react-icons/fi';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // Redirect if accessed directly without state
  useEffect(() => {
    if (!state?.name) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.name) return null;

  const { name, taskTitle, emailSent } = state;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full animate-slide-up">
        {/* Success Card */}
        <div className="card p-8 sm:p-10 text-center">
          {/* Success Icon */}
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center">
              <FiCheckCircle size={36} className="text-green-400" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            You're In! 🎉
          </h1>
          <p className="text-slate-400 mb-8">
            Hey <span className="text-white font-semibold">{name}</span>, your application 
            has been received and processed successfully.
          </p>

          {/* Task Info */}
          {taskTitle && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <FiCpu size={16} className="text-primary-400" />
                <span className="text-sm font-semibold text-slate-300">Your AI-Generated Task</span>
              </div>
              <p className="text-primary-400 font-semibold">{taskTitle}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <FiClock size={12} />
                Deadline: 7 days from now
              </div>
            </div>
          )}

          {/* Email Status */}
          <div
            className={`flex items-center justify-center gap-2 p-4 rounded-xl mb-8 ${
              emailSent
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
            }`}
          >
            <FiMail size={16} />
            <span className="text-sm font-medium">
              {emailSent
                ? 'Task details sent to your email inbox!'
                : 'Task generated — check your spam folder or contact support'}
            </span>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📋 Next Steps:</h3>
            <ol className="space-y-2">
              {[
                'Check your email for the detailed task',
                'Read the requirements carefully',
                'Complete the task within 7 days',
                'Push your code to GitHub',
                'Reply to the email with your GitHub link',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <span className="w-5 h-5 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-slate-700 text-sm"
            >
              <FiArrowLeft size={15} />
              Back to Home
            </Link>
            <Link
              to="/apply"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium px-6 py-3 rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all text-sm"
            >
              Apply Again
            </Link>
          </div>
        </div>

        {/* Good luck message */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Good luck with your task! We're rooting for you. 🚀
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
