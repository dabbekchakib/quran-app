import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaUndo, FaHistory, FaHandSparkles } from 'react-icons/fa';
import {
  getTodayTasbih,
  addTasbih,
  incrementTasbih,
  resetTasbih,
  deleteTasbih,
  getTodayKey,
} from '../services/tasbihService';

const Tasbih = () => {
  const [tasbihList, setTasbihList] = useState([]);
  const [label, setLabel] = useState('');
  const [animatingId, setAnimatingId] = useState(null);

  const todayKey = getTodayKey();

  useEffect(() => {
    document.title = 'التسبيح - القرآن الكريم';
    setTasbihList(getTodayTasbih());
  }, []);

  const todayDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAdd = useCallback((e) => {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    const updated = addTasbih(trimmed);
    setTasbihList([...updated]);
    setLabel('');
  }, [label]);

  const handleIncrement = useCallback((id) => {
    const updated = incrementTasbih(id);
    setTasbihList([...updated]);
    setAnimatingId(id);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => setAnimatingId(null), 200);
  }, []);

  const handleReset = useCallback((id) => {
    const updated = resetTasbih(id);
    setTasbihList([...updated]);
  }, []);

  const handleDelete = useCallback((id) => {
    const updated = deleteTasbih(id);
    setTasbihList([...updated]);
  }, []);

  const totalCount = tasbihList.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaHandSparkles className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-2">
          التسبيح
        </h1>
        <p className="text-slate-400 text-sm mb-1">{todayDate}</p>
        <p className="text-slate-500 text-xs font-mono" dir="ltr">{todayKey}</p>
        {tasbihList.length > 0 && (
          <p className="text-teal-400 text-lg mt-2 font-bold">
            المجموع: {totalCount}
          </p>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="أضف تسبيحاً جديداً..."
          className="flex-1 px-4 py-3 bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400/50 transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={!label.trim()}
          className="px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl text-sm font-medium transition-all disabled:text-slate-500 flex items-center gap-2"
        >
          <FaPlus size={14} />
          أضف
        </button>
      </form>

      <div className="space-y-4 mb-28">
        {tasbihList.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <FaHandSparkles className="text-4xl mx-auto mb-4 opacity-30" />
            <p>لا توجد تسبيحات اليوم</p>
            <p className="text-xs mt-1">أضف تسبيحاً جديداً للبدء</p>
          </div>
        )}
        {tasbihList.map((item) => {
          const pct = item.target > 0 ? Math.min(100, (item.count / item.target) * 100) : 0;
          const isComplete = item.count >= item.target;
          return (
            <div
              key={item.id}
              className={`bg-slate-800/40 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-200 ${
                isComplete ? 'border-emerald-500/30' : 'border-teal-500/10'
              } ${animatingId === item.id ? 'scale-[1.02] ring-2 ring-teal-400/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-slate-100 font-[Amiri]">
                  {item.label}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleReset(item.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-700/50 transition-all"
                    title="إعادة تعيين"
                    aria-label="إعادة تعيين"
                  >
                    <FaUndo size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700/50 transition-all"
                    title="حذف"
                    aria-label="حذف"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-5xl sm:text-6xl font-bold text-teal-300 tabular-nums transition-all duration-200 font-[Amiri] leading-none">
                  {item.count}
                </span>
                <span className="text-xs text-slate-500">/{item.target}</span>
              </div>

              <div className="w-full h-1.5 bg-slate-700 rounded-full mb-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-emerald-400' : 'bg-gradient-to-l from-teal-400 to-emerald-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <button
                onClick={() => handleIncrement(item.id)}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-[0.98] text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-teal-500/10"
              >
                +1
              </button>
            </div>
          );
        })}
      </div>

      {tasbihList.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center pointer-events-none">
          <Link
            to="/tasbih/history"
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-slate-800/80 backdrop-blur-md border border-teal-500/20 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm shadow-xl"
          >
            <FaHistory size={14} />
            سجل التسبيح
          </Link>
        </div>
      )}
    </div>
  );
};

export default Tasbih;
