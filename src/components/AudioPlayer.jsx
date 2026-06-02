import { useState, useCallback } from 'react';
import {
  FaPlay, FaPause, FaStop, FaForward, FaBackward,
  FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward,
  FaRedo, FaRandom, FaChevronDown, FaChevronUp,
  FaLayerGroup,
} from 'react-icons/fa';
import useAudioPlayer from '../hooks/useAudioPlayer';
import { formatTime } from '../utils/helpers';

const repeatIcons = {
  'normal': null,
  'repeat-ayah': FaRedo,
  'repeat-surah': FaRedo,
  'repeat-all': FaRandom,
};

const AudioPlayer = () => {
  const {
    currentSurah, currentAyah, totalAyahs,
    isPlaying, currentTime, duration, progress,
    repeatMode, volume, isMuted, REPEAT_MODES,
    playbackMode,
    togglePlay, stop, nextAyah, prevAyah,
    nextSurah, prevSurah,
    setVolume, seek, setRepeat, setPlaybackMode,
    hasPrevAyah, hasNextAyah, hasPrevSurah, hasNextSurah,
  } = useAudioPlayer();

  const [minimized, setMinimized] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seek(pos * duration);
  }, [duration, seek]);

  const cycleRepeat = useCallback(() => {
    const modes = [REPEAT_MODES.NORMAL, REPEAT_MODES.REPEAT_AYAH, REPEAT_MODES.REPEAT_SURAH, REPEAT_MODES.REPEAT_ALL];
    const idx = modes.indexOf(repeatMode);
    setRepeat(modes[(idx + 1) % modes.length]);
  }, [repeatMode, setRepeat, REPEAT_MODES]);

  if (!currentSurah || !currentAyah) return null;

  const RepeatIcon = repeatIcons[repeatMode];
  const isRepeatActive = repeatMode !== REPEAT_MODES.NORMAL;

  return (
    <div
      className="fixed bottom-0 right-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-teal-500/20 shadow-2xl shadow-black/30"
      role="region"
      aria-label="مشغل الصوت العالمي"
    >
      {!minimized && (
        <div className="px-4 pt-3 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-teal-400 font-[Amiri] text-sm truncate">
                  {currentSurah.name}
                </span>
                <span className="text-slate-500 text-xs shrink-0">
                  {playbackMode === 'surah' ? 'تلاوة كاملة' : `${currentAyah.numberInSurah}:${totalAyahs}`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPlaybackMode(playbackMode === 'surah' ? 'verse' : 'surah')}
                  className={`p-1.5 rounded-lg transition-colors text-[10px] ${
                    playbackMode === 'surah' ? 'text-teal-300 bg-teal-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label={playbackMode === 'surah' ? 'التحول إلى تلاوة آية آية' : 'التحول إلى تلاوة كاملة'}
                  title={playbackMode === 'surah' ? 'تلاوة كاملة' : 'آية آية'}
                >
                  <FaLayerGroup size={10} className="ml-1" />
                  {playbackMode === 'surah' ? 'سورة' : 'آية'}
                </button>
                <button
                  onClick={cycleRepeat}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isRepeatActive ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  aria-label={`التكرار: ${repeatMode}`}
                  title={`التكرار: ${repeatMode}`}
                >
                  {RepeatIcon && <RepeatIcon size={12} />}
                </button>
                <button
                  onClick={() => setMinimized(true)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="تصغير"
                >
                  <FaChevronDown size={12} />
                </button>
              </div>
            </div>

            <div
              className="relative h-1.5 bg-slate-700 rounded-full cursor-pointer group mb-2"
              onClick={handleSeek}
              role="slider"
              aria-label="شريط التقدم"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  const step = e.key === 'ArrowRight' ? 5 : -5;
                  seek(Math.max(0, Math.min(currentTime + step, duration)));
                }
              }}
            >
              <div
                className="absolute top-0 right-0 h-full bg-gradient-to-l from-teal-400 to-emerald-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-400 rounded-full shadow-lg shadow-teal-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ right: `${progress}%`, marginRight: '-6px' }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button onClick={prevSurah} disabled={!hasPrevSurah}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-300 hover:bg-slate-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label="السورة السابقة">
                  <FaStepBackward size={10} />
                </button>
                <button onClick={prevAyah} disabled={!hasPrevAyah}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="الآية السابقة">
                  <FaBackward size={12} />
                </button>

                <button onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all active:scale-95 mx-1"
                  aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}>
                  {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="mr-0.5" />}
                </button>

                <button onClick={stop}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all"
                  aria-label="إيقاف">
                  <FaStop size={12} />
                </button>

                <button onClick={nextAyah} disabled={!hasNextAyah}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="الآية التالية">
                  <FaForward size={12} />
                </button>
                <button onClick={nextSurah} disabled={!hasNextSurah}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-300 hover:bg-slate-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label="السورة التالية">
                  <FaStepForward size={10} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-mono min-w-[60px] text-left" dir="ltr">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="relative hidden sm:block">
                  <button onClick={() => setShowVolume(!showVolume)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 transition-colors"
                    aria-label="مستوى الصوت">
                    {isMuted ? <FaVolumeMute size={12} /> : <FaVolumeUp size={12} />}
                  </button>
                  {showVolume && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
                      <input type="range" min="0" max="1" step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 h-1 appearance-none bg-slate-600 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400"
                        aria-label="مستوى الصوت" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {minimized && (
        <div className="px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white shrink-0"
                aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}>
                {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} className="mr-0.5" />}
              </button>
              <div className="min-w-0">
                <p className="text-sm text-slate-200 font-[Amiri] truncate">{currentSurah.name}</p>
                <p className="text-[10px] text-slate-500">
                  {playbackMode === 'surah' ? 'تلاوة كاملة' : `آية ${currentAyah.numberInSurah} / ${totalAyahs}`}
                </p>
              </div>
              <div className="flex-1 h-1 bg-slate-700 rounded-full mx-2 max-w-[200px]">
                <div className="h-full bg-gradient-to-l from-teal-400 to-emerald-400 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={prevAyah} disabled={!hasPrevAyah}
                className="p-1 text-slate-400 hover:text-teal-300 disabled:opacity-30"
                aria-label="الآية السابقة">
                <FaBackward size={10} />
              </button>
              <button onClick={nextAyah} disabled={!hasNextAyah}
                className="p-1 text-slate-400 hover:text-teal-300 disabled:opacity-30"
                aria-label="الآية التالية">
                <FaForward size={10} />
              </button>
              <button onClick={() => setMinimized(false)}
                className="p-1 text-slate-500 hover:text-slate-300"
                aria-label="تكبير">
                <FaChevronUp size={10} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
