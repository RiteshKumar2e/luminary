import type { User } from '../types';

export const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@luminary.ai',
  username: 'demo',
  full_name: 'Demo User',
  is_active: true,
  is_verified: true,
  avatar_url: undefined,
  bio: 'Exploring Luminary AI in demo mode.',
  industry: 'Creative',
  plan: 'pro',
  created_at: new Date().toISOString(),
};

export const DEMO_TOKEN = 'demo-token-luminary-not-real';

export const isDemoToken = (token: string | null) =>
  token === DEMO_TOKEN;
