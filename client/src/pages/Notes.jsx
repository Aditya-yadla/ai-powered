import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import {
  BookOpen,
  PlusCircle,
  Filter,
  Search,
  Trash2,
  Edit,
  Sparkles,
  Tag,
  Clock,
  ExternalLink
} from 'lucide-react';

const Notes = ({ onOpenCreateModal, onEditNote }) => {
  const { showToast } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [subjectsList, setSubjectsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject, searchQuery]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let url = `/notes?subject=${encodeURIComponent(selectedSubject)}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await API.get(url);
      if (res.data.success) {
        setNotes(res.data.data);

        // Populate unique subjects for dropdown filter
        const allSubjects = Array.from(
          new Set(res.data.data.map((n) => n.subject))
        );
        setSubjectsList(allSubjects);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      showToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await API.delete(`/notes/${id}`);
      if (res.data.success) {
        showToast('Note deleted successfully', 'success');
        setNotes(notes.filter((n) => n._id !== id));
      }
    } catch (err) {
      showToast('Error deleting note', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            My Study Notes
          </h1>
          <p className="text-xs text-slate-400">
            Organize, view, edit, and launch AI assistance for your lecture notes.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Note</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search within titles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-brand-500 text-slate-200 text-sm rounded-xl px-3 py-2 outline-none w-full md:w-auto"
          >
            <option value="All">All Subjects</option>
            {subjectsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <Loader text="Loading your study notes..." />
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="glass-card glass-card-hover rounded-2xl border border-slate-800 p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {note.subject}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{note.title}</h3>
                <p className="text-xs text-sky-300 font-medium">Topic: {note.topic}</p>
                <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                  {note.content}
                </p>

                {note.keywords && note.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.keywords.slice(0, 4).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px] font-medium border border-slate-800"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/notes/${note._id}`}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Full Note"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onEditNote(note)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-brand-400 hover:bg-slate-800 transition-colors"
                    title="Edit Note"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id, note.title)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  to={`/ai-assistant?noteId=${note._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 hover:bg-brand-500/25 text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Assist</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Notes Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            {searchQuery
              ? `No study notes matched "${searchQuery}". Try a different keyword.`
              : 'You have not created any notes for this subject yet.'}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Note</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Notes;
