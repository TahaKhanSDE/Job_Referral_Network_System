import { api } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'FRESHER' | 'PROFESSIONAL' | 'HR';
}

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export const authService = {
  async login({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password, role });
    // Controller returns { success, user, token }
    const { user, token } = response.data as { success: boolean; user: AuthUser; token: string };
    return { user, token };
  },

  async signup({
    name,
    email,
    password,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { name, email, password, role });
    // Controller returns { success, user, token }
    const { user, token } = response.data as { success: boolean; user: AuthUser; token: string };
    return { user, token };
    // NOTE: token storage is intentionally left to the caller (useAuthStore)
    // to keep a single source of truth in the store.
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => {
      // best-effort server logout; always clear local state
    });
    localStorage.removeItem('authToken');
  },

  async getMe(): Promise<AuthUser> {
    const response = await api.get('/auth/me');
    // Controller returns { success, user }
    return (response.data.user ?? response.data) as AuthUser;
  },

  async handleGoogleCallback(token: string): Promise<AuthResponse> {
    // Store the token first so getMe() can attach it to the Authorization header
    localStorage.setItem('authToken', token);
    try {
      const user = await this.getMe();
      return { user, token };
    } catch {
      localStorage.removeItem('authToken');
      throw new Error('Invalid OAuth token — could not fetch user profile');
    }
  },
};
