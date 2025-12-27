export interface EmotionResult {
  emotion: string;
  confidence: number;
}

const emotionKeywords: Record<string, string[]> = {
  joy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'fantastic', 'great', 'love', 'awesome', 'perfect', 'excellent', 'delighted', 'thrilled', 'cheerful', 'pleased', 'glad'],
  sadness: ['sad', 'unhappy', 'depressed', 'miserable', 'disappointed', 'heartbroken', 'unfortunate', 'terrible', 'awful', 'hopeless', 'crying', 'tears', 'sorrow', 'grief'],
  anger: ['angry', 'furious', 'mad', 'irritated', 'annoyed', 'rage', 'frustrated', 'outraged', 'livid', 'hatred', 'disgust', 'hate'],
  fear: ['afraid', 'scared', 'fear', 'terrified', 'worried', 'anxious', 'nervous', 'panic', 'frightened', 'concern', 'alarmed'],
  love: ['love', 'adore', 'cherish', 'affection', 'romantic', 'sweetheart', 'darling', 'beloved', 'caring', 'tender', 'devoted'],
  surprise: ['surprised', 'shock', 'astonished', 'amazed', 'unexpected', 'sudden', 'wow', 'unbelievable', 'incredible', 'stunning'],
  neutral: ['okay', 'fine', 'normal', 'average', 'usual', 'regular', 'standard'],
};

const emotionPunctuation: Record<string, RegExp[]> = {
  joy: [/!{2,}/, /😊|😄|😃|🙂|😁|🎉|✨/],
  sadness: [/😢|😭|💔|😔/],
  anger: [/😠|😡|🤬|💢/],
  surprise: [/\?!|!\?/, /😮|😲|🤯/],
  love: [/❤️|💕|💖|😍|🥰/],
};

export function analyzeEmotion(text: string): EmotionResult[] {
  const lowerText = text.toLowerCase();
  const emotionScores: Record<string, number> = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    love: 0,
    surprise: 0,
    neutral: 0,
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        emotionScores[emotion] += matches.length * 0.15;
      }
    }
  }

  for (const [emotion, patterns] of Object.entries(emotionPunctuation)) {
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        emotionScores[emotion] += matches.length * 0.1;
      }
    }
  }

  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0) {
    emotionScores.joy += exclamationCount * 0.05;
    emotionScores.surprise += exclamationCount * 0.03;
  }

  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount > 0) {
    emotionScores.surprise += questionCount * 0.03;
  }

  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.3) {
    emotionScores.anger += 0.15;
    emotionScores.joy += 0.1;
  }

  if (Object.values(emotionScores).every(score => score < 0.1)) {
    emotionScores.neutral = 0.6;
  }

  const totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);

  const normalizedEmotions = Object.entries(emotionScores)
    .map(([emotion, score]) => ({
      emotion,
      confidence: totalScore > 0 ? score / totalScore : 0,
    }))
    .filter(e => e.confidence > 0.05)
    .sort((a, b) => b.confidence - a.confidence);

  if (normalizedEmotions.length === 0) {
    return [{ emotion: 'neutral', confidence: 1.0 }];
  }

  return normalizedEmotions;
}
