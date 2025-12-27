import { Smile, Frown, Heart, AlertCircle, Laugh, Meh, Flame, Lightbulb, Sparkles } from 'lucide-react';

interface EmotionResult {
  emotion: string;
  confidence: number;
  scores?: Record<string, number>;
}

interface EmotionResultsProps {
  emotions: EmotionResult[];
  isAnalyzing: boolean;
}

// Extended emotion colors for all 28 emotions
const emotionColors: Record<string, {
  bg: string;
  bar: string;
  text: string;
  glow: string;
  gradient: string;
  gradient2: string;
}> = {
  joy: { bg: 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30', bar: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: 'text-yellow-300', glow: 'from-yellow-500/50 to-orange-500/50', gradient: 'from-yellow-500 to-orange-400', gradient2: 'from-yellow-600 to-orange-600' },
  excitement: { bg: 'bg-gradient-to-br from-red-900/30 to-orange-900/30', bar: 'bg-gradient-to-r from-red-400 to-orange-500', text: 'text-red-300', glow: 'from-red-500/50 to-orange-500/50', gradient: 'from-red-500 to-orange-400', gradient2: 'from-red-600 to-orange-600' },
  sadness: { bg: 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30', bar: 'bg-gradient-to-r from-blue-400 to-cyan-500', text: 'text-blue-300', glow: 'from-blue-500/50 to-cyan-500/50', gradient: 'from-blue-500 to-cyan-400', gradient2: 'from-blue-600 to-cyan-600' },
  anger: { bg: 'bg-gradient-to-br from-red-900/30 to-pink-900/30', bar: 'bg-gradient-to-r from-red-500 to-pink-500', text: 'text-red-300', glow: 'from-red-600/50 to-pink-600/50', gradient: 'from-red-500 to-pink-400', gradient2: 'from-red-700 to-pink-700' },
  fear: { bg: 'bg-gradient-to-br from-purple-900/30 to-red-900/30', bar: 'bg-gradient-to-r from-purple-500 to-red-500', text: 'text-purple-300', glow: 'from-purple-600/50 to-red-600/50', gradient: 'from-purple-500 to-red-400', gradient2: 'from-purple-700 to-red-700' },
  love: { bg: 'bg-gradient-to-br from-pink-900/30 to-rose-900/30', bar: 'bg-gradient-to-r from-pink-500 to-rose-500', text: 'text-pink-300', glow: 'from-pink-600/50 to-rose-600/50', gradient: 'from-pink-500 to-rose-400', gradient2: 'from-pink-700 to-rose-700' },
  surprise: { bg: 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30', bar: 'bg-gradient-to-r from-cyan-400 to-blue-500', text: 'text-cyan-300', glow: 'from-cyan-500/50 to-blue-500/50', gradient: 'from-cyan-500 to-blue-400', gradient2: 'from-cyan-600 to-blue-600' },
  neutral: { bg: 'bg-gradient-to-br from-gray-800/30 to-slate-800/30', bar: 'bg-gradient-to-r from-gray-500 to-slate-500', text: 'text-gray-300', glow: 'from-gray-500/50 to-slate-500/50', gradient: 'from-gray-500 to-slate-400', gradient2: 'from-gray-700 to-slate-700' },
  admiration: { bg: 'bg-gradient-to-br from-blue-900/30 to-purple-900/30', bar: 'bg-gradient-to-r from-blue-400 to-purple-500', text: 'text-blue-300', glow: 'from-blue-500/50 to-purple-500/50', gradient: 'from-blue-500 to-purple-400', gradient2: 'from-blue-600 to-purple-600' },
  amusement: { bg: 'bg-gradient-to-br from-green-900/30 to-lime-900/30', bar: 'bg-gradient-to-r from-green-400 to-lime-500', text: 'text-green-300', glow: 'from-green-500/50 to-lime-500/50', gradient: 'from-green-500 to-lime-400', gradient2: 'from-green-600 to-lime-600' },
  annoyance: { bg: 'bg-gradient-to-br from-orange-900/30 to-yellow-900/30', bar: 'bg-gradient-to-r from-orange-400 to-yellow-500', text: 'text-orange-300', glow: 'from-orange-500/50 to-yellow-500/50', gradient: 'from-orange-500 to-yellow-400', gradient2: 'from-orange-600 to-yellow-600' },
  approval: { bg: 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30', bar: 'bg-gradient-to-r from-emerald-400 to-teal-500', text: 'text-emerald-300', glow: 'from-emerald-500/50 to-teal-500/50', gradient: 'from-emerald-500 to-teal-400', gradient2: 'from-emerald-600 to-teal-600' },
  caring: { bg: 'bg-gradient-to-br from-pink-900/30 to-purple-900/30', bar: 'bg-gradient-to-r from-pink-400 to-purple-500', text: 'text-pink-300', glow: 'from-pink-500/50 to-purple-500/50', gradient: 'from-pink-500 to-purple-400', gradient2: 'from-pink-600 to-purple-600' },
  confusion: { bg: 'bg-gradient-to-br from-slate-900/30 to-gray-900/30', bar: 'bg-gradient-to-r from-slate-400 to-gray-500', text: 'text-slate-300', glow: 'from-slate-500/50 to-gray-500/50', gradient: 'from-slate-500 to-gray-400', gradient2: 'from-slate-600 to-gray-600' },
  curiosity: { bg: 'bg-gradient-to-br from-indigo-900/30 to-blue-900/30', bar: 'bg-gradient-to-r from-indigo-400 to-blue-500', text: 'text-indigo-300', glow: 'from-indigo-500/50 to-blue-500/50', gradient: 'from-indigo-500 to-blue-400', gradient2: 'from-indigo-600 to-blue-600' },
  desire: { bg: 'bg-gradient-to-br from-rose-900/30 to-red-900/30', bar: 'bg-gradient-to-r from-rose-400 to-red-500', text: 'text-rose-300', glow: 'from-rose-500/50 to-red-500/50', gradient: 'from-rose-500 to-red-400', gradient2: 'from-rose-600 to-red-600' },
  disappointment: { bg: 'bg-gradient-to-br from-slate-900/30 to-blue-900/30', bar: 'bg-gradient-to-r from-slate-400 to-blue-500', text: 'text-slate-300', glow: 'from-slate-500/50 to-blue-500/50', gradient: 'from-slate-500 to-blue-400', gradient2: 'from-slate-600 to-blue-600' },
  disapproval: { bg: 'bg-gradient-to-br from-gray-900/30 to-slate-900/30', bar: 'bg-gradient-to-r from-gray-400 to-slate-500', text: 'text-gray-300', glow: 'from-gray-500/50 to-slate-500/50', gradient: 'from-gray-500 to-slate-400', gradient2: 'from-gray-600 to-slate-600' },
  disgust: { bg: 'bg-gradient-to-br from-yellow-900/30 to-green-900/30', bar: 'bg-gradient-to-r from-yellow-500 to-green-600', text: 'text-yellow-300', glow: 'from-yellow-600/50 to-green-600/50', gradient: 'from-yellow-500 to-green-500', gradient2: 'from-yellow-700 to-green-700' },
  embarrassment: { bg: 'bg-gradient-to-br from-pink-900/30 to-red-900/30', bar: 'bg-gradient-to-r from-pink-400 to-red-500', text: 'text-pink-300', glow: 'from-pink-500/50 to-red-500/50', gradient: 'from-pink-500 to-red-400', gradient2: 'from-pink-600 to-red-600' },
  gratitude: { bg: 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30', bar: 'bg-gradient-to-r from-amber-400 to-yellow-500', text: 'text-amber-300', glow: 'from-amber-500/50 to-yellow-500/50', gradient: 'from-amber-500 to-yellow-400', gradient2: 'from-amber-600 to-yellow-600' },
  grief: { bg: 'bg-gradient-to-br from-slate-900/30 to-blue-900/30', bar: 'bg-gradient-to-r from-slate-500 to-blue-600', text: 'text-slate-300', glow: 'from-slate-600/50 to-blue-600/50', gradient: 'from-slate-500 to-blue-500', gradient2: 'from-slate-700 to-blue-700' },
  nervousness: { bg: 'bg-gradient-to-br from-orange-900/30 to-red-900/30', bar: 'bg-gradient-to-r from-orange-400 to-red-500', text: 'text-orange-300', glow: 'from-orange-500/50 to-red-500/50', gradient: 'from-orange-500 to-red-400', gradient2: 'from-orange-600 to-red-600' },
  optimism: { bg: 'bg-gradient-to-br from-green-900/30 to-emerald-900/30', bar: 'bg-gradient-to-r from-green-400 to-emerald-500', text: 'text-green-300', glow: 'from-green-500/50 to-emerald-500/50', gradient: 'from-green-500 to-emerald-400', gradient2: 'from-green-600 to-emerald-600' },
  pride: { bg: 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30', bar: 'bg-gradient-to-r from-purple-400 to-indigo-500', text: 'text-purple-300', glow: 'from-purple-500/50 to-indigo-500/50', gradient: 'from-purple-500 to-indigo-400', gradient2: 'from-purple-600 to-indigo-600' },
  realization: { bg: 'bg-gradient-to-br from-cyan-900/30 to-green-900/30', bar: 'bg-gradient-to-r from-cyan-400 to-green-500', text: 'text-cyan-300', glow: 'from-cyan-500/50 to-green-500/50', gradient: 'from-cyan-500 to-green-400', gradient2: 'from-cyan-600 to-green-600' },
  relief: { bg: 'bg-gradient-to-br from-green-900/30 to-teal-900/30', bar: 'bg-gradient-to-r from-green-400 to-teal-500', text: 'text-green-300', glow: 'from-green-500/50 to-teal-500/50', gradient: 'from-green-500 to-teal-400', gradient2: 'from-green-600 to-teal-600' },
  remorse: { bg: 'bg-gradient-to-br from-red-900/30 to-purple-900/30', bar: 'bg-gradient-to-r from-red-500 to-purple-600', text: 'text-red-300', glow: 'from-red-600/50 to-purple-600/50', gradient: 'from-red-500 to-purple-500', gradient2: 'from-red-700 to-purple-700' },
};

export default function EmotionResults({ emotions, isAnalyzing }: EmotionResultsProps) {
  const primaryEmotion = emotions[0];

  if (isAnalyzing) {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse opacity-75" />
              <div className="absolute inset-2 border-4 border-transparent border-t-cyan-400 border-r-blue-400 rounded-full animate-spin" />
              <Sparkles className="relative w-12 h-12 text-cyan-300 mx-auto mt-6" />
            </div>
            <p className="text-lg font-bold text-white">Analyzing emotions...</p>
            <p className="text-gray-300 text-sm mt-2">Connecting to AI model for deep analysis</p>
          </div>
        </div>
      </div>
    );
  }

  if (emotions.length === 0) {
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
              <Sparkles className="relative w-20 h-20 text-gray-400 mx-auto" />
            </div>
            <p className="text-white text-xl font-bold">Ready to discover emotions</p>
            <p className="text-gray-300 text-sm mt-3 max-w-xs">Share your thoughts and let AI reveal the emotions within your words</p>
          </div>
        </div>
      </div>
    );
  }

  const colors = emotionColors[primaryEmotion.emotion] || emotionColors.neutral;

  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.glow} rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 transition-all duration-300 hover:border-white/40 hover:bg-white/15">
        <h2 className="text-white font-bold mb-8 text-xl tracking-wide">Emotional Analysis</h2>

        <div className={`${colors.bg} rounded-2xl p-8 mb-8 transition-all border border-white/10 group/primary relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient2}/20 opacity-0 group-hover/primary:opacity-100 transition-opacity rounded-2xl`} />

          <div className="relative flex items-center gap-4 mb-6">
            <div className={`relative p-4 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg shadow-white/20`}>
              <Laugh className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Primary Emotion</p>
              <p className={`text-4xl font-black ${colors.text} capitalize drop-shadow-lg`}>
                {primaryEmotion.emotion}
              </p>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 font-medium">Confidence Level</span>
              <span className={`text-2xl font-bold ${colors.text}`}>
                {Math.round(primaryEmotion.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-900/50 rounded-full h-4 overflow-hidden border border-white/10">
              <div
                className={`${colors.bar} h-full rounded-full transition-all duration-1200 ease-out shadow-lg shadow-white/20`}
                style={{ width: `${primaryEmotion.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Display emotion scores if available */}
        {primaryEmotion.scores && (
          <div>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6">
              Emotional Spectrum (All 28 Emotions)
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {Object.entries(primaryEmotion.scores)
                .sort(([, a], [, b]) => b - a)
                .map(([emotion, score], index) => {
                  const emotionColor = emotionColors[emotion] || emotionColors.neutral;

                  return (
                    <div
                      key={emotion}
                      className="group/emotion relative p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                      style={{
                        animation: `slideIn 0.6s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${emotionColor.gradient2}/10 opacity-0 group-hover/emotion:opacity-100 transition-opacity rounded-lg`} />

                      <div className="relative flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white capitalize text-sm truncate">
                              {emotion}
                            </span>
                            <span className={`text-xs font-bold ${emotionColor.text} drop-shadow-sm flex-shrink-0 ml-2`}>
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-800/60 rounded-full h-1.5 overflow-hidden border border-white/10">
                            <div
                              className={`${emotionColor.bar} h-full rounded-full transition-all duration-1200 ease-out`}
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
