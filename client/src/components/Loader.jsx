import React from 'react';
import { Sparkles } from 'lucide-react';

export const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
        <Sparkles className="w-5 h-5 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-slate-800 rounded-md w-3/4"></div>
    <div className="h-4 bg-slate-850 rounded-md w-1/2"></div>
    <div className="space-y-2 pt-2">
      <div className="h-3 bg-slate-850 rounded w-full"></div>
      <div className="h-3 bg-slate-850 rounded w-5/6"></div>
      <div className="h-3 bg-slate-850 rounded w-4/6"></div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-6 bg-slate-800 rounded-full w-16"></div>
      <div className="h-6 bg-slate-800 rounded-full w-20"></div>
    </div>
  </div>
);
