export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface Settings {
  voiceAssistant: boolean;
  autoRead: boolean;
  accessibility: boolean;
}

export interface ImageAnalysisRequest {
  prompt: string;
  image: string;
  sessionId: string;
  language?: string;
}

export interface ImageAnalysisResponse {
  role: string;
  content: string;
  timestamp: string;
}
