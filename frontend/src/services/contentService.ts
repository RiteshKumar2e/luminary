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
};
