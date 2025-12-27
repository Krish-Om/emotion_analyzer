import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import TextInput from './components/TextInput';
import EmotionResults from './components/EmotionResults';
import { analyzeEmotion, checkHealth, APIError } from './utils/api';

interface EmotionResult {
  emotion: string;
  confidence: number;
  scores?: Record<string, number>;
}

function App() {
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Check if server is running on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        await checkHealth();
        setServerError(null);
      } catch (error) {
        if (error instanceof APIError) {
          setServerError(error.message);
        } else {
          setServerError('Failed to connect to server');
        }
      }
    };

    checkServer();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setServerError(null);

    try {
      const result = await analyzeEmotion(text);
      // Convert API response to EmotionResult format
      const emotionResults: EmotionResult[] = [
        {
          emotion: result.emotion,
          confidence: result.confidence,
          scores: result.scores,
        },
      ];
      setEmotions(emotionResults);
    } catch (error) {
      if (error instanceof APIError) {
        setServerError(error.message);
      } else {
        setServerError('An unexpected error occurred');
      }
      setEmotions([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setEmotions([]);
    setServerError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute -top-20 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-slow-drift" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Error Banner */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-semibold">Server Error</p>
                <p className="text-red-200 text-sm">{serverError}</p>
              </div>
            </div>
          )}

          <header className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-4 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="relative w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-xl">
                  Emotion Recognizer
                </h1>
                <div className="h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full" />
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Unveil the emotional essence hidden within every word. Experience AI-powered emotion detection that truly understands you.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <TextInput
              text={text}
              setText={setText}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
            />

            <EmotionResults
              emotions={emotions}
              isAnalyzing={isAnalyzing}
            />
          </div>

          <footer className="text-center mt-16 pt-8 border-t border-gray-700 border-opacity-30">
            <p className="text-gray-400 text-sm mb-2">Powered by FastAPI & BERT AI</p>
            <p className="text-gray-500 text-xs">Transform text into emotional intelligence</p>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes slow-drift {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(20px) translateX(-30px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-slow-drift {
          animation: slow-drift 12s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;
