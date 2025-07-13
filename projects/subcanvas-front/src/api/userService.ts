import axiosClient from './axiosClient';
import { User, LoginCredentials, RegisterData, AuthResponse, SnsAccount } from '../types';

export const userService = {
  // 로그인
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // 회원가입
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // 소셜 로그인
  async socialLogin(provider: string, token: string): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>(`/auth/social/${provider}`, { token });
    return response.data;
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    const response = await axiosClient.get<User>('/users/me');
    return response.data;
  },

  // 사용자 정보 업데이트
  async updateUser(userId: string, userData: { nickname?: string; password?: string; currentPassword?: string }): Promise<User> {
    const response = await axiosClient.patch<User>(`/users/${userId}`, userData);
    return response.data;
  },

  // 사용자 계정 삭제
  async deleteUser(userId: string, currentPassword?: string): Promise<{ message: string }> {
    const response = await axiosClient.delete<{ message: string }>(`/users/${userId}`, {
      data: { currentPassword }
    });
    return response.data;
  },

  // SNS 계정 추가
  async addSnsAccount(userId: string, snsType: string, snsUrl: string): Promise<SnsAccount> {
    const response = await axiosClient.post<SnsAccount>(`/users/${userId}/sns-accounts`, { snsType, snsUrl });
    return response.data;
  },

  // SNS 계정 삭제
  async deleteSnsAccount(userId: string, snsAccountId: number): Promise<void> {
    await axiosClient.delete(`/users/${userId}/sns-accounts/${snsAccountId}`);
  }
};

export default userService;
