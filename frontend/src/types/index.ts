// ============================================================
// Global Types — Luminary AI
// ============================================================

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  bio?: string;
  industry?: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  full_name: string;
  password: string;
  industry?: string;
}

// Content types
export interface StoryRequest {
  title?: string;
  genre: string;
  tone: string;
  length: 'short' | 'medium' | 'long';
  prompt: string;
  characters?: string[];
  setting?: string;
}

export interface CampaignRequest {
  brand_name: string;
  product: string;
  target_audience: string;
  campaign_goal: string;
  tone: string;
  platforms?: string[];
  budget_level: string;
}

export interface BrandKitRequest {
  brand_name: string;
  industry: string;
  brand_personality: string;
  target_audience: string;
  values?: string[];
}

export interface CaptionRequest {
  platform: string;
  content_description: string;
  tone: string;
  include_hashtags: boolean;
  count: number;
}

export interface ScriptRequest {
  script_type: string;
  topic: string;
  duration_seconds: number;
  tone: string;
  target_audience?: string;
}

export interface GenerationResult {
  content: string;
  analysis?: WatsonAnalysis;
  tokens_used: number;
}

// Watson Analysis
export interface WatsonAnalysis {
  sentiment?: {
    document: { label: string; score: number };
  };
  dominant_emotion?: string;
  emotions?: Record<string, number>;
  top_keywords?: string[];
  entities?: string[];
  quality_score?: number;
  word_count?: number;
  readability?: string;
}

// History
export interface HistoryItem {
  id: string;
  feature_type: string;
  prompt: string;
  result: string;
  watson_analysis?: WatsonAnalysis;
  tokens_used: number;
  model_used: string;
  status: string;
  created_at: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  skip: number;
  limit: number;
}

// Asset
export interface Asset {
  id: string;
  user_id: string;
  name: string;
  file_type: string;
  file_url?: string;
  content?: string;
  description?: string;
  category?: string;
  file_size: number;
  is_ai_generated: boolean;
  tags?: string;
  created_at: string;
}

export interface AssetListResponse {
  items: Asset[];
  total: number;
}

// API generic
export interface ApiError {
  detail: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Muse Chat
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  tokens_used: number;
}

// Creative DNA / Style Profile
export interface StyleProfile {
  has_data: boolean;
  message?: string;
  total_analyzed?: number;
  dominant_emotion?: string;
  emotion_profile?: Record<string, number>;
  sentiment_breakdown?: Record<string, number>;
  top_keywords?: string[];
  feature_counts?: Record<string, number>;
  dominant_tool?: string;
  creative_signature?: string;
}

// Mood Board
export interface MoodBoardPhoto {
  url: string;
  large_url: string;
  photographer: string;
  alt: string;
  pexels_url: string;
}

export interface MoodBoardResponse {
  photos: MoodBoardPhoto[];
  query: string;
}
