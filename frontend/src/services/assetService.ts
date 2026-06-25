import api from './api';
import type { AssetListResponse, Asset } from '../types';

export const assetService = {
  async listAssets(params?: { skip?: number; limit?: number; category?: string }): Promise<AssetListResponse> {
    const res = await api.get<AssetListResponse>('/assets/', { params });
    return res.data;
  },

  async uploadAsset(
    file: File,
    meta: { name?: string; category?: string; description?: string }
  ): Promise<Asset> {
    const form = new FormData();
    form.append('file', file);
    if (meta.name) form.append('name', meta.name);
    if (meta.category) form.append('category', meta.category);
    if (meta.description) form.append('description', meta.description);
    const res = await api.post<Asset>('/assets/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async createTextAsset(data: {
    name: string;
    content: string;
    category?: string;
    description?: string;
  }): Promise<Asset> {
    const form = new FormData();
    form.append('name', data.name);
    form.append('content', data.content);
    if (data.category) form.append('category', data.category);
    if (data.description) form.append('description', data.description);
    const res = await api.post<Asset>('/assets/text', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getAsset(id: string): Promise<Asset> {
    const res = await api.get<Asset>(`/assets/${id}`);
    return res.data;
  },

  async deleteAsset(id: string) {
    const res = await api.delete(`/assets/${id}`);
    return res.data;
  },
};
