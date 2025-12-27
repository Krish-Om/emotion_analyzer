import { Trash2, Zap } from 'lucide-react';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export default function TextInput({ text, setText, onAnalyze, onClear, isAnalyzing }: TextInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onAnalyze();
    }
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 transition-all duration-300 hover:border-white/40 hover:bg-white/15">
        <div className="mb-6">
          <label className="block text-white font-bold mb-2 text-lg tracking-wide">
            Share Your Emotions
          </label>
          <p className="text-gray-300 text-sm">
            Type or paste any text to discover its emotional dimensions
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Share your thoughts, feelings, or any text you'd like to analyze...

Try: 'I'm so excited about this opportunity! It's absolutely amazing!'"
          className="w-full h-64 p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none resize-none transition-all backdrop-blur-sm"
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">{text.length}</span> chars
            {text.length > 0 && (
              <>
                <span className="text-gray-500 mx-2">•</span>
                <span className="font-semibold text-white">{text.split(/\s+/).filter(Boolean).length}</span> words
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClear}
              disabled={!text}
              className="px-5 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium backdrop-blur-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>

            <button
              onClick={onAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="group/btn relative px-8 py-2.5 font-bold text-white rounded-lg overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-100 group-hover/btn:opacity-90 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity blur-lg" />

              <div className="relative flex items-center gap-2">
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-right">
          Press Ctrl + Enter to analyze
        </p>
      </div>
    </div>
  );
}
