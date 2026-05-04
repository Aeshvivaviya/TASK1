import React from 'react';
import { FiZap, FiCpu, FiMail, FiShield } from 'react-icons/fi';
import CareerForm from '../components/CareerForm';

const benefits = [
  { icon: FiCpu, text: 'AI analyzes your profile instantly' },
  { icon: FiZap, text: 'Personalized task in under 30 seconds' },
  { icon: FiMail, text: 'Task delivered to your inbox' },
  { icon: FiShield, text: 'Your data is safe and private' },
];

const ApplyPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <FiZap size={14} />
            Smart Application
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Apply for a <span className="text-gradient">Position</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Fill out the form below. Our AI will analyze your profile and send you a 
            personalized technical task within seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Benefits Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* What Happens Next */}
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FiZap className="text-primary-400" size={16} />
                What happens next?
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon size={14} className="text-primary-400" />
                    </div>
                    <p className="text-slate-300 text-sm">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card p-6 bg-gradient-to-br from-accent-500/5 to-primary-500/5 border-accent-500/20">
              <h3 className="font-semibold text-white mb-3">💡 Tips for a better task</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  Add all your relevant skills for a more accurate task
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  Include your portfolio/GitHub for better context
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">→</span>
                  Select the experience level that matches your actual skills
                </li>
              </ul>
            </div>

            {/* Tech Stack Badge */}
            <div className="card p-5">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Powered by</p>
              <div className="flex flex-wrap gap-2">
                {['OpenAI GPT', 'Node.js', 'MongoDB', 'React'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Application Form</h2>
                <p className="text-slate-400 text-sm mt-1">
                  All fields marked with <span className="text-red-400">*</span> are required
                </p>
              </div>
              <CareerForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
