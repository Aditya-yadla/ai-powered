import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import {
  BookOpen,
  Folder,
  Sparkles,
  Search,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = ({ onOpenCreateModal }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalSubjects: 0,
    subjects: [],
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notes/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartColors = ['#0c94eb', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="bg-gradient-to-r from-brand-400 to-sky-400 bg-clip-text text-transparent">{user?.name || 'Student'}</span> 👋
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Organize your study notes, perform keyword search, and use AI to simplify complex lecture topics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-sky-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Note</span>
            </button>
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-brand-500/50 hover:text-white font-semibold text-sm transition-all"
            >
              <Brain className="w-4 h-4 text-brand-400" />
              <span>AI Study Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading dashboard analytics..." />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Study Notes
                </span>
                <p className="text-3xl font-extrabold text-white">{stats.totalNotes}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Subjects
                </span>
                <p className="text-3xl font-extrabold text-white">{stats.totalSubjects}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Folder className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Study Tools
                </span>
                <p className="text-3xl font-extrabold text-brand-400">Ready</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Analytics Chart & Subject Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-400" />
                    Note Distribution by Subject
                  </h3>
                  <p className="text-xs text-slate-400">Overview of notes organized per subject category</p>
                </div>
              </div>

              {stats.subjects && stats.subjects.length > 0 ? (
                <div className="h-64 pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.subjects}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#f8fafc'
                        }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {stats.subjects.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                  No notes recorded yet to display analytics chart.
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Quick Study Actions</h3>
                <p className="text-xs text-slate-400 mb-4">Fast access to core learning tools</p>

                <div className="space-y-3">
                  <Link
                    to="/notes"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 text-slate-200 text-sm font-medium transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-brand-400" />
                      Browse All Notes
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/search"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 text-slate-200 text-sm font-medium transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-sky-400" />
                      Search & Filter Notes
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/ai-assistant"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-sm font-medium transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-400" />
                      Explain & Summarize
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Recent Study Notes</h3>
              <Link to="/notes" className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1">
                View All Notes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.recentNotes && stats.recentNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.recentNotes.map((note) => (
                  <div
                    key={note._id}
                    className="glass-card glass-card-hover rounded-2xl border border-slate-800 p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          {note.subject}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white line-clamp-1">{note.title}</h4>
                      <p className="text-xs text-sky-300 font-medium">Topic: {note.topic}</p>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-4">
                      <Link
                        to={`/notes/${note._id}`}
                        className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        Open Note →
                      </Link>
                      <Link
                        to={`/ai-assistant?noteId=${note._id}`}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-medium text-slate-300 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-brand-400" />
                        <span>AI Assist</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center border border-slate-800 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-300 text-sm font-medium">No study notes found yet.</p>
                <p className="text-slate-500 text-xs">Create your first note to start managing study material.</p>
                <button
                  onClick={onOpenCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Note</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
