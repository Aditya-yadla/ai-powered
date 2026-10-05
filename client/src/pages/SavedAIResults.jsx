import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import AIResultCard from '../components/AIResultCard';
import { BookmarkCheck, Trash2, Sparkles, BookOpen } from 'lucide-react';

const SavedAIResults = () => {
  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(AuthContext);

  useEffect(() => {
    fetchSavedResults();
  }, []);

  const fetchSavedResults = async () => {
    try {
      setLoading(true);
      const res = await API.get('/ai-results');
      if (res.data.success) {
        setSavedResults(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading saved AI results', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this saved AI result?')) return;
    try {
      const res = await API.delete(`/ai-results/${id}`);
      if (res.data.success) {
        showToast('Saved AI result removed', 'success');
        setSavedResults(savedResults.filter((r) => r._id !== id));
      }
    } catch (err) {
      showToast('Error deleting saved AI result', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookmarkCheck className="w-6 h-6 text-brand-400" />
          Saved AI Explanations & Summaries
        </h1>
        <p className="text-xs text-slate-400">
          SRS FR6: Access all saved AI explanations and summaries associated with your study notes.
        </p>
      </div>

      {loading ? (
        <Loader text="Retrieving saved AI study results..." />
      ) : savedResults.length > 0 ? (
        <div className="space-y-6">
          {savedResults.map((item) => (
            <div key={item._id} className="relative group">
              <AIResultCard result={item} isSaved={true} />
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-6 right-36 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1"
                title="Delete saved result"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved AI Results Yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            When you generate AI explanations or summaries, click "Save Result" to store them here for exam revision.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedAIResults;
