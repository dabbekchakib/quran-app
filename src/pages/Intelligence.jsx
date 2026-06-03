import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaKey, FaBrain, FaBookOpen, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { askAI } from '../services/aiService';

const PRESETS = [
  {
    label: 'تفسير آية',
    icon: FaBookOpen,
    getPrompt: (text) => `فسر لي الآية التالية من القرآن الكريم باللغة العربية:\n\n${text}\n\nقدم التفسير بما يشمل: المعنى العام، سبب النزول إن وجد، الأحكام المستفادة، والبلاغة في الآية.`,
  },
  {
    label: 'سؤال ديني',
    icon: FaBrain,
    getPrompt: (text) => `أجب عن السؤال التالي مستنداً إلى القرآن الكريم والسنة النبوية:\n\n${text}\n\nاذكر الأدلة من القرآن والسنة إن أمكن.`,
  },
  {
    label: 'بحث في القرآن',
    icon: FaSearch,
    getPrompt: (text) => `ابحث في القرآن الكريم عن:\n\n${text}\n\nاذكر الآيات ذات الصلة مع تفسير مختصر.`,
  },
];

const Intelligence = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const responseRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    document.title = 'الذكاء الاصطناعي - القرآن الكريم';
  }, []);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openrouter_key', key);
    setShowKeyInput(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const answer = await askAI(prompt.trim(), apiKey);
      setResponse(answer || '(لا يوجد رد)');
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('مفتاح API غير صالح. يرجى التحقق من المفتاح في إعدادات OpenRouter.');
      } else {
        setError('فشل الاتصال. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setActivePreset(preset);
    const text = prompt || '';
    setPrompt(preset.getPrompt(text));
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaRobot className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          الذكاء الاصطناعي
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          اسأل عن القرآن والتفسير والأحكام الشرعية
        </p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl mb-6">
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="w-full flex items-center justify-between p-4 text-slate-300 hover:text-slate-100 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm">
            <FaKey className="text-teal-400" />
            {apiKey ? 'مفتاح API متصل' : 'إعداد مفتاح OpenRouter'}
          </span>
          {showKeyInput ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
        {showKeyInput && (
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="أدخل مفتاح OpenRouter API"
                className="flex-1 px-4 py-2.5 text-sm bg-slate-700/50 border border-teal-500/20 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
              />
              <button
                onClick={() => saveApiKey(apiKey)}
                disabled={!apiKey.trim()}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm transition-colors"
              >
                حفظ
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              احصل على مفتاح مجاني من{' '}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 underline">
                openrouter.ai/keys
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all duration-200 ${
              activePreset === preset
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                : 'bg-slate-800/30 border-slate-600/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
          >
            <preset.icon size={14} />
            {preset.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={activePreset ? `${activePreset.label}...` : 'اكتب سؤالك عن القرآن والتفسير...'}
            rows={4}
            className="w-full px-5 py-4 bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400/50 transition-colors resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e);
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {loading ? 'جاري المعالجة...' : 'Ctrl+Enter للإرسال'}
            {!apiKey && !showKeyInput && (
              <button onClick={() => setShowKeyInput(true)} className="mr-3 text-amber-400 hover:text-amber-300 underline">
                أدخل مفتاح API
              </button>
            )}
          </span>
          <button
            type="submit"
            disabled={!prompt.trim() || loading || !apiKey}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl text-sm font-medium transition-all duration-200 disabled:text-slate-500 shadow-lg shadow-teal-500/10 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الرد...
              </span>
            ) : (
              <>
                <FaPaperPlane size={14} />
                أرسل
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-500/20 rounded-2xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center">
              <FaRobot className="text-sm text-teal-400" />
            </div>
            <span className="text-sm text-slate-400 font-medium">الرد</span>
          </div>
          <div
            ref={responseRef}
            className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto"
            dir="auto"
          >
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default Intelligence;
