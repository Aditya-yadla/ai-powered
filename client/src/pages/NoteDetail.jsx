import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Edit,
  Trash2,
  Clock,
  Folder,
  Tag,
  Zap
} from 'lucide-react';

const NoteDetail = ({ onEditNote }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/notes/${id}`);
      if (res.data.success) {
        setNote(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching note details:', err);
      showToast('Could not find note', 'error');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    try {
      const res = await API.delete(`/notes/${id}`);
      if (res.data.success) {
        showToast('Note deleted', 'success');
        navigate('/notes');
      }
    } catch (err) {
      showToast('Error deleting note', 'error');
    }
  };

  if (loading) {
    return <Loader text="Opening study note..." />;
  }

  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/notes"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Notes</span>
      </Link>

      {/* Note Header */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {note.subject}
            </span>
            <span className="text-xs font-medium text-sky-400 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5" />
              {note.topic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditNote(note)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-900/50 text-xs font-medium text-rose-300 hover:bg-rose-900/50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{note.title}</h1>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </span>
          <span>•</span>
          <span>Last Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>

        {note.keywords && note.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {note.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-brand-400" />
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Action Banner */}
      <div className="glass-card rounded-2xl border border-brand-500/30 p-6 bg-gradient-to-r from-slate-900 via-brand-950/30 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Analyze & Simplify with AI
          </h3>
          <p className="text-xs text-slate-400">
            Generate simple explanations, short key points, or high-yield exam summaries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/ai-assistant?noteId=${note._id}&mode=explain`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Explain</span>
          </Link>
          <Link
            to={`/ai-assistant?noteId=${note._id}&mode=summarize`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Summarize</span>
          </Link>
        </div>
      </div>

      {/* Note Content Body */}
      <div className="glass-card rounded-2xl border border-slate-800 p-8 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Study Note Content
        </h3>
        <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
          {note.content}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
