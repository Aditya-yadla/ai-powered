import React, { useState } from 'react';
import { Copy, Check, BookmarkPlus, Sparkles, BookOpen, Clock } from 'lucide-react';

const AIResultCard = ({ result, onSave, isSaved = false }) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!result || !result.content) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      await onSave(result);
      setSaving(false);
    }
  };

  const typeLabels = {
    explanation: 'AI Simple Explanation',
    short_summary: 'AI Short Summary (3-5 Points)',
    medium_summary: 'AI Medium Summary',
    exam_summary: 'AI High-Yield Exam Summary'
  };

  const typeBadges = {
    explanation: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    short_summary: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    medium_summary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    exam_summary: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              typeBadges[result.result_type] || typeBadges.explanation
            }`}
          >
            {typeLabels[result.result_type] || 'AI Generated Result'}
          </span>
          {result.source_title && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {result.source_title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {!isSaved && onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/40 text-brand-300 hover:bg-brand-500/30 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Result'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Content */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm whitespace-pre-line leading-relaxed">
        {result.content}
      </div>

      {result.createdAt && (
        <div className="pt-3 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Generated on {new Date(result.createdAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default AIResultCard;
