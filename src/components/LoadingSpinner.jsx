import { memo } from 'react';
import { FaQuran } from 'react-icons/fa';

const LoadingSpinner = memo(({ text = 'جاري التحميل...' }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4"
      role="status"
      aria-label={text}
    >
      <div className="relative">
        <FaQuran className="text-4xl text-teal-500/30 animate-pulse" />
        <div className="absolute inset-0 border-2 border-teal-400/30 rounded-full animate-spin" />
      </div>
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
