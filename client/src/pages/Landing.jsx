import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Brain,
  Sparkles,
  BookOpen,
  Search,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Note Management',
      desc: 'Create, organize, and edit study notes by subjects and topics with automatic timestamping.'
    },
    {
      icon: Search,
      title: 'Multi-Field Keyword Search',
      desc: 'Instantly find matching study material across titles, subjects, topics, keywords, and content.'
    },
    {
      icon: Brain,
      title: 'AI Concept Simplification',
      desc: 'Transform difficult academic concepts into student-friendly explanations with bullet points and practical examples.'
    },
    {
      icon: Zap,
      title: '3-Tier AI Summarization',
      desc: 'Generate Short (3-5 points), Medium, or Exam-focused high-yield summaries tailored to your revision needs.'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SRS-Compliant Student Learning Assistant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Master Your Studies with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            AI-Powered Notes & Summaries
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Organize lecture material, perform keyword search across notes, and leverage AI to break down complex topics into simple explanations and exam-oriented summaries.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-sky-500 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-sky-500 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Studying Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 font-semibold text-base transition-all flex items-center justify-center"
              >
                Existing Student Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Designed for Modern College Students
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Reduce manual study effort and accelerate exam preparation with intelligent note organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-slate-300">AI-Powered Student Notes & Study Assistant</span>
          </div>
          <p>© 2026 SRS-Compliant Full Stack MERN System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
