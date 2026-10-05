import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, Tag, FileText, FolderPlus } from 'lucide-react';

const NoteModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    topic: '',
    content: '',
    keywords: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subject: initialData.subject || '',
        topic: initialData.topic || '',
        content: initialData.content || '',
        keywords: Array.isArray(initialData.keywords)
          ? initialData.keywords.join(', ')
          : initialData.keywords || ''
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        topic: '',
        content: '',
        keywords: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const commonSubjects = ['Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'Economics', 'History', 'Literature'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-slate-100">
              {initialData ? 'Edit Study Note' : 'Create New Study Note'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Note Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Data Structures: Binary Search Trees"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject / Category *
              </label>
              <input
                type="text"
                required
                list="subjects-list"
                placeholder="e.g., Computer Science"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
              <datalist id="subjects-list">
                {commonSubjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic / Chapter *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Tree Data Structures"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., BST, Tree, Search, Algorithms"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Note Content *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Write or paste your detailed study notes, definitions, formulas, or lecture material here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl p-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all leading-relaxed"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm shadow-lg shadow-brand-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Note' : 'Save Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
