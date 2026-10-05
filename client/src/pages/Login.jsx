import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-2">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Student Sign In</h2>
          <p className="text-xs text-slate-400">
            Access your study notes, AI explanations, and saved summaries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-sky-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
