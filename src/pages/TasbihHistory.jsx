import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHandSparkles, FaTrash } from 'react-icons/fa';
import { getTasbihHistory, saveTasbihHistory, getTodayKey } from '../services/tasbihService';

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

const TasbihHistory = () => {
  const [history, setHistory] = useState({});
  const todayKey = getTodayKey();

  useEffect(() => {
    document.title = 'سجل التسبيح - القرآن الكريم';
    setHistory(getTasbihHistory());
  }, []);

  const sortedDates = Object.keys(history)
    .filter((k) => history[k].length > 0)
    .sort((a, b) => b.localeCompare(a));

  const getDayTotal = (items) => items.reduce((sum, t) => sum + t.count, 0);

  const handleDeleteDay = (dateKey) => {
    const updated = { ...history };
    delete updated[dateKey];
    saveTasbihHistory(updated);
    setHistory(updated);
  };

  const handleDeleteEntry = (dateKey, entryId) => {
    const updated = { ...history };
    updated[dateKey] = updated[dateKey].filter((t) => t.id !== entryId);
    if (updated[dateKey].length === 0) delete updated[dateKey];
    saveTasbihHistory(updated);
    setHistory(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaHandSparkles className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          سجل التسبيح
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mb-4">
          استعراض أيام التسبيح السابقة
        </p>
        <Link
          to="/tasbih"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 hover:border-teal-500/30 transition-all text-xs"
        >
          <FaArrowRight />
          العودة للتسبيح
        </Link>
      </div>

      {sortedDates.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <FaHandSparkles className="text-4xl mx-auto mb-4 opacity-30" />
          <p className="text-sm sm:text-base">لا يوجد سجل تسبيح بعد</p>
          <Link
            to="/tasbih"
            className="text-teal-400 hover:text-teal-300 underline text-sm mt-2 inline-block"
          >
            ابدأ التسبيح
          </Link>
        </div>
      )}

      <div className="space-y-6 mb-20">
        {sortedDates.map((dateKey) => {
          const items = history[dateKey];
          const dayTotal = getDayTotal(items);
          const isToday = dateKey === todayKey;
          return (
            <div
              key={dateKey}
              className={`bg-slate-800/40 backdrop-blur-sm border rounded-2xl overflow-hidden ${
                isToday ? 'border-teal-500/30' : 'border-slate-700/30'
              }`}
            >
              <div
                className={`px-6 py-3 flex items-center justify-between ${
                  isToday ? 'bg-teal-500/10' : 'bg-slate-700/20'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {isToday ? 'اليوم' : formatDate(dateKey)}
                  </span>
                  <span className="text-xs text-slate-500 font-mono shrink-0" dir="ltr">
                    {dateKey}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-teal-400 font-bold">{dayTotal}</span>
                  <button
                    onClick={() => handleDeleteDay(dateKey)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-all"
                    title="حذف هذا اليوم"
                    aria-label="حذف هذا اليوم"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-3">
                {items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between bg-slate-700/20 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {entry.label}
                      </span>
                      <span className="text-lg font-bold text-teal-300 tabular-nums shrink-0">
                        {entry.count}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(dateKey, entry.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-all shrink-0"
                      title="حذف"
                      aria-label="حذف"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasbihHistory;
