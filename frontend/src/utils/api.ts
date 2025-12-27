// API Configuration
const API_BASE_URL = "http://localhost:8000";

// Response types
export interface EmotionAnalysisResponse {
  text: string;
  emotion: string;
  scores: Record<string, number>;
  confidence: number;
}

export interface EmotionsListResponse {
  available_emotions: string[];
  count: number;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  model_loaded: boolean;
}

// Error handling
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Check if the API server is running and healthy
 */
export async function checkHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new APIError(response.status, "Failed to connect to server");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      0,
      "Unable to reach the server. Make sure the backend is running on http://localhost:8000"
    );
  }
}

/**
 * Get list of all available emotions
 */
export async function getAvailableEmotions(): Promise<EmotionsListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/emotions`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new APIError(response.status, "Failed to fetch emotions list");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, "Failed to fetch emotions list");
  }
}

/**
 * Analyze emotion in the given text
 * @param text - The text to analyze
 * @returns Promise with emotion analysis results
 */
export async function analyzeEmotion(
  text: string
): Promise<EmotionAnalysisResponse> {
  if (!text.trim()) {
    throw new APIError(400, "Text cannot be empty");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new APIError(
        response.status,
        errorData.detail || "Failed to analyze emotion"
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      0,
      "Failed to analyze emotion. Make sure the backend is running."
    );
  }
}

/**
 * Get top emotions from analysis results
 * @param scores - The emotion scores object
 * @param limit - Number of top emotions to return
 */
export function getTopEmotions(
  scores: Record<string, number>,
  limit: number = 5
): Array<{ emotion: string; score: number }> {
  return Object.entries(scores)
    .map(([emotion, score]) => ({ emotion, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Format confidence percentage
 * @param confidence - Confidence value (0-1)
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
