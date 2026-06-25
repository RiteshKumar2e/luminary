import api from './api';
import type {
  TokenResponse,
  LoginForm,
  RegisterForm,
  User,
} from '../types';

export const authService = {
  async login(data: LoginForm): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>('/auth/login', data);
    return res.data;
  },

  async register(data: RegisterForm): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>('/auth/register', data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put<User>('/auth/me', data);
    return res.data;
  },

  async changePassword(data: { current_password: string; new_password: string }) {
    const res = await api.put('/auth/me/password', data);
    return res.data;
  },
};
