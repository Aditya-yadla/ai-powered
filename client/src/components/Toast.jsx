import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useContext(AuthContext);

  if (!toast) return null;

  const { message, type } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-200',
    info: 'border-sky-500/30 bg-sky-950/80 text-sky-200'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all ${
          borders[type] || borders.info
        }`}
      >
        {icons[type] || icons.info}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
