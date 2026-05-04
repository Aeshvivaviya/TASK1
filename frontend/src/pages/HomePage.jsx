import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiZap, FiCpu, FiMail, FiArrowRight,
  FiCode, FiUsers, FiTrendingUp, FiCheckCircle,
} from 'react-icons/fi';

const features = [
  {
    icon: FiCode,
    title: 'Smart Application Form',
    description: 'Fill out a clean, validated form with your skills, experience, and portfolio link.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: FiCpu,
    title: 'AI-Powered Analysis',
    description: 'Our AI analyzes your profile and generates a personalized technical task tailored to your skills.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: FiMail,
    title: 'Instant Email Delivery',
    description: 'Receive your custom task directly in your inbox with detailed instructions and requirements.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
];

const steps = [
  { step: '01', title: 'Fill the Form', desc: 'Enter your details, skills, and experience level' },
  { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes your profile in seconds' },
  { step: '03', title: 'Task Generated', desc: 'A personalized technical task is created for you' },
  { step: '04', title: 'Check Email', desc: 'Receive your task with full instructions via email' },
];

const stats = [
  { value: '500+', label: 'Candidates Processed', icon: FiUsers },
  { value: '98%', label: 'Email Delivery Rate', icon: FiMail },
  { value: '<30s', label: 'AI Response Time', icon: FiZap },
  { value: '100%', label: 'Personalized Tasks', icon: FiTrendingUp },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-6 animate-fade-in">
            <FiZap size={14} />
            AI-Powered Career Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
            Land Your Dream Job
            <br />
            <span className="text-gradient">Smarter & Faster</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Apply once. Our AI analyzes your skills and generates a personalized technical task 
            delivered straight to your inbox — no generic tests, just tasks built for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all shadow-xl shadow-primary-500/30 text-base"
            >
              Apply Now
              <FiArrowRight size={18} />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-slate-700 text-base"
            >
              View Admin Panel
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gradient">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A seamless hiring experience powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`card p-6 border ${feature.bg} hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} border flex items-center justify-center mb-4`}>
                  <feature.icon size={22} className={feature.color} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Journey in <span className="text-gradient">4 Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-500/50 to-transparent z-0" />
                )}
                <div className="card p-6 text-center relative z-10 hover:border-primary-500/30 transition-colors">
                  <div className="text-4xl font-black text-gradient mb-3">{step.step}</div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-10 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/20">
            <FiCheckCircle size={40} className="text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-400 mb-8">
              Join hundreds of developers who've already received personalized technical tasks 
              and landed their dream jobs.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold px-10 py-4 rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all shadow-xl shadow-primary-500/30 text-base"
            >
              Apply Now — It's Free
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center">
        <p className="text-slate-500 text-sm">
          © 2024 Career Portal. Built with React, Node.js & AI.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
