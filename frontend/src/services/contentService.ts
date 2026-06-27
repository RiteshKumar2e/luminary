import api from './api';
import type {
  GenerationResult,
  StoryRequest,
  CampaignRequest,
  BrandKitRequest,
  CaptionRequest,
  ScriptRequest,
  HistoryResponse,
  WatsonAnalysis,
  ChatMessage,
  ChatResponse,
  StyleProfile,
  MoodBoardResponse,
} from '../types';

export const contentService = {
  async generateStory(data: StoryRequest): Promise<GenerationResult> {
    const res = await api.post<GenerationResult>('/creative/story', data);
    return res.data;
  },

  async generateCampaign(data: CampaignRequest): Promise<GenerationResult> {
    const res = await api.post<GenerationResult>('/creative/campaign', data);
    return res.data;
  },

  async generateBrandKit(data: BrandKitRequest): Promise<GenerationResult> {
    const res = await api.post<GenerationResult>('/creative/brand-kit', data);
    return res.data;
  },

  async generateCaptions(data: CaptionRequest): Promise<GenerationResult> {
    const res = await api.post<GenerationResult>('/creative/captions', data);
    return res.data;
  },

  async generateScript(data: ScriptRequest): Promise<GenerationResult> {
    const res = await api.post<GenerationResult>('/creative/script', data);
    return res.data;
  },

  async brainstorm(topic: string, category: string, count = 8): Promise<GenerationResult> {
    const res = await api.get<GenerationResult>('/creative/brainstorm', {
      params: { topic, category, count },
    });
    return res.data;
  },

  async analyzeContent(text: string): Promise<{ analysis: WatsonAnalysis }> {
    const res = await api.post<{ analysis: WatsonAnalysis }>('/creative/analyze', { text });
    return res.data;
  },

  async getHistory(params?: {
    skip?: number;
    limit?: number;
    feature_type?: string;
  }): Promise<HistoryResponse> {
    const res = await api.get<HistoryResponse>('/creative/history', { params });
    return res.data;
  },

  async deleteHistoryItem(id: string) {
    const res = await api.delete(`/creative/history/${id}`);
    return res.data;
  },

  async chat(messages: ChatMessage[], context?: string): Promise<ChatResponse> {
    const res = await api.post<ChatResponse>('/creative/chat', { messages, context });
    return res.data;
  },

  async getStyleProfile(): Promise<StyleProfile> {
    const res = await api.get<StyleProfile>('/creative/style-profile');
    return res.data;
  },

  async getMoodBoard(keywords: string): Promise<MoodBoardResponse> {
    const res = await api.get<MoodBoardResponse>('/creative/mood-board', { params: { keywords } });
    return res.data;
  },

  async generateStoryBranch(data: {
    genre: string;
    tone: string;
    characters?: string[];
    setting?: string;
    previous_segments: string[];
    choices_made: string[];
    selected_choice: string;
  }): Promise<{
    segment: string;
    choices: string[];
    analysis: WatsonAnalysis;
    tokens_used: number;
  }> {
    const res = await api.post<{
      segment: string;
      choices: string[];
      analysis: WatsonAnalysis;
      tokens_used: number;
    }>('/creative/story/branch', data);
    return res.data;
  },

  async runCampaignTest(data: {
    campaign_topic: string;
    variant_a: string;
    variant_b: string;
    target_persona: string;
  }): Promise<{
    variant_a_metrics: { ctr: number; conversion: number; readability: number; emotional_resonance: string };
    variant_b_metrics: { ctr: number; conversion: number; readability: number; emotional_resonance: string };
    winner: string;
    comparative_analysis: string;
    persona_feedback: Array<{ name: string; age: number; occupation: string; sentiment: string; comment: string }>;
    variant_a_improvements: string[];
    variant_b_improvements: string[];
  }> {
    const res = await api.post<any>('/creative/campaign/test', data);
    return res.data;
  },

  async generateCampaignVariant(data: {
    variant_a: string;
    tone_or_style: string;
  }): Promise<{
    content: string;
    tokens_used: number;
  }> {
    const res = await api.post<{
      content: string;
      tokens_used: number;
    }>('/creative/campaign/generate-variant', data);
    return res.data;
  },
};

