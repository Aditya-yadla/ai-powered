import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import {
  Search,
  Filter,
  BookOpen,
  Sparkles,
  Clock,
  ExternalLink,
  Tag,
  AlertCircle
} from 'lucide-react';

const SearchNotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);

  const { showToast } = useContext(AuthContext);

  useEffect(() => {
    fetchInitialSubjects();
    if (initialQuery) {
      handleSearch(initialQuery, selectedSubject);
    }
  }, []);

  const fetchInitialSubjects = async () => {
    try {
      const res = await API.get('/notes');
      if (res.data.success) {
        const subs = Array.from(new Set(res.data.data.map((n) => n.subject)));
        setSubjectsList(subs);
        if (!initialQuery) {
          setNotes(res.data.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (searchQuery, subjectFilter) => {
    try {
      setLoading(true);
      setHasSearched(true);
      let url = `/notes?subject=${encodeURIComponent(subjectFilter)}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await API.get(url);
      if (res.data.success) {
        setNotes(res.data.data);
      }
    } catch (err) {
      showToast('Search request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    handleSearch(query, selectedSubject);
  };

  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setSelectedSubject(val);
    handleSearch(query, val);
  };

  // Helper function for search keyword highlighting (FR3 requirement)
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-400/30 text-amber-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-brand-400" />
          Search & Discover Study Notes
        </h1>
        <p className="text-xs text-slate-400">
          SRS FR3: Search across note title, subject, topic, keywords, and content.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type keywords (e.g. 'Binary Tree', 'Entropy', 'Normalization')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="bg-slate-900 border border-slate-800 focus:border-brand-500 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none w-full md:w-auto"
          >
            <option value="All">All Subjects</option>
            {subjectsList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-md transition-all shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results Display */}
      {loading ? (
        <Loader text="Searching study material..." />
      ) : notes.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-medium">
            Found <span className="text-brand-400 font-bold">{notes.length}</span> matching note(s)
            {query && (
              <span>
                {' '}
                for "<span className="text-slate-200">{query}</span>"
              </span>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="glass-card glass-card-hover rounded-2xl border border-slate-800 p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {highlightText(note.subject, query)}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {highlightText(note.title, query)}
                  </h3>
                  <p className="text-xs text-sky-300 font-medium">
                    Topic: {highlightText(note.topic, query)}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                    {highlightText(note.content, query)}
                  </p>

                  {note.keywords && note.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.keywords.slice(0, 4).map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px] font-medium border border-slate-800"
                        >
                          #{highlightText(kw, query)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-4">
                  <Link
                    to={`/notes/${note._id}`}
                    className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1"
                  >
                    View Note <ExternalLink className="w-3 h-3" />
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
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Notes Found for Your Search</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            "No notes found for your search." Try adjusting your search keywords or switching subject filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchNotes;
