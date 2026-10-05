import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { explainNoteWithAI, summarizeNoteWithAI } from '../services/aiService';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import AIResultCard from '../components/AIResultCard';
import {
  Sparkles,
  BookOpen,
  Zap,
  HelpCircle,
  FileText,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';

const AIStudyAssistant = () => {
  const [searchParams] = useSearchParams();
  const preselectedNoteId = searchParams.get('noteId') || '';
  const preselectedMode = searchParams.get('mode') || 'explain';

  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(preselectedNoteId);
  const [customText, setCustomText] = useState('');
  const [activeTab, setActiveTab] = useState(preselectedMode === 'summarize' ? 'summarize' : 'explain');
  const [summaryOption, setSummaryOption] = useState('short'); // 'short' | 'medium' | 'exam'

  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await API.get('/notes');
      if (res.data.success) {
        setNotes(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerateAI = async () => {
    let title = 'Custom Material';
    let subject = 'General';
    let topic = 'General Topic';
    let contentToProcess = customText;

    if (selectedNoteId) {
      const selectedNote = notes.find((n) => n._id === selectedNoteId);
      if (selectedNote) {
        title = selectedNote.title;
        subject = selectedNote.subject;
        topic = selectedNote.topic;
        contentToProcess = selectedNote.content;
      }
    }

    if (!contentToProcess || contentToProcess.trim().length < 10) {
      showToast('Please select a saved note or enter at least 10 characters of study material.', 'error');
      return;
    }

    try {
      setGenerating(true);
      setAiResult(null);

      if (activeTab === 'explain') {
        const res = await explainNoteWithAI(title, subject, topic, contentToProcess);
        setAiResult({
          ...res,
          source_title: title,
          noteId: selectedNoteId || null
        });
      } else {
        const res = await summarizeNoteWithAI(title, subject, topic, contentToProcess, summaryOption);
        setAiResult({
          ...res,
          source_title: title,
          noteId: selectedNoteId || null
        });
      }
      showToast('AI analysis completed successfully!', 'success');
    } catch (err) {
      showToast('AI service is temporarily unavailable. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveResult = async (resultToSave) => {
    try {
      const res = await API.post('/ai-results', {
        noteId: resultToSave.noteId || null,
        result_type: resultToSave.result_type,
        result_content: resultToSave.content,
        source_title: resultToSave.source_title
      });

      if (res.data.success) {
        showToast('AI Result saved to your collection!', 'success');
      }
    } catch (err) {
      showToast('Failed to save AI Result', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-400" />
          AI Study Assistant & Learning Engine
        </h1>
        <p className="text-xs text-slate-400">
          SRS FR4 & FR5: Explain complex concepts in simple terms or generate short, medium, and exam summaries.
        </p>
      </div>

      {/* Input Selection Card */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
        {/* Source Switcher */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            1. Select Study Material Source
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-slate-400 mb-1 font-medium">Choose Saved Note:</span>
              <select
                value={selectedNoteId}
                onChange={(e) => {
                  setSelectedNoteId(e.target.value);
                  if (e.target.value) setCustomText('');
                }}
                disabled={loadingNotes}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 text-slate-200 text-sm rounded-xl px-3 py-2.5 outline-none"
              >
                <option value="">-- Custom Text Input --</option>
                {notes.map((n) => (
                  <option key={n._id} value={n._id}>
                    {n.subject}: {n.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs text-slate-400 mb-1 font-medium">Or Paste Custom Text:</span>
              <textarea
                rows={2}
                disabled={Boolean(selectedNoteId)}
                placeholder={selectedNoteId ? "Note selected above. Clear dropdown to type custom text." : "Paste lecture material, definitions, or study notes..."}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 text-slate-200 text-xs rounded-xl p-2.5 outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Feature Tab Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            2. Choose AI Service Mode
          </label>

          <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'explain'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>AI Explanation (FR4)</span>
            </button>

            <button
              onClick={() => setActiveTab('summarize')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'summarize'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>AI Summarization (FR5)</span>
            </button>
          </div>

          {/* Summarization Mode Selector (FR5 options) */}
          {activeTab === 'summarize' && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Summary Type:</span>
              <button
                onClick={() => setSummaryOption('short')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  summaryOption === 'short'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Short (3-5 Key Points)
              </button>
              <button
                onClick={() => setSummaryOption('medium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  summaryOption === 'medium'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Medium Summary
              </button>
              <button
                onClick={() => setSummaryOption('exam')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  summaryOption === 'exam'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 High-Yield Exam Review
              </button>
            </div>
          )}
        </div>

        {/* Generate Trigger Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerateAI}
            disabled={generating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 via-sky-500 to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            <span>
              {generating
                ? 'Processing Study Material with AI...'
                : activeTab === 'explain'
                ? 'Generate AI Explanation'
                : `Generate ${summaryOption.toUpperCase()} AI Summary`}
            </span>
          </button>
        </div>
      </div>

      {/* Output Panel */}
      {generating && (
        <div className="glass-card rounded-2xl p-8 border border-slate-800">
          <Loader text="AI is analyzing concepts, definitions, and key points..." />
        </div>
      )}

      {aiResult && !generating && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            AI Output Result
          </h3>
          <AIResultCard result={aiResult} onSave={handleSaveResult} />
        </div>
      )}
    </div>
  );
};

export default AIStudyAssistant;
