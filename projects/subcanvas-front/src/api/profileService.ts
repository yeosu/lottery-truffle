import axiosClient from './axiosClient';
import type { ProfilePage, ProfileContent } from '../types';

interface PageVisit {
  id: number;
  profileId: number;
  visitorIp?: string;
  visitedAt: string;
  referrer?: string;
}

export const profileService = {
  // 사용자의 모든 프로필 페이지 조회
  async getUserProfiles(userId?: string): Promise<ProfilePage[]> {
    const url = userId ? `/profiles/user/${userId}` : '/profiles/user/me';
    const response = await axiosClient.get<ProfilePage[]>(url);
    return response.data;
  },

  // 특정 프로필 페이지 조회 (URL 경로로)
  async getProfileByPath(pagePath: string): Promise<ProfilePage> {
    const response = await axiosClient.get<ProfilePage>(`/profiles/path/${pagePath}`);
    return response.data;
  },

  // 특정 프로필 페이지 조회 (ID로)
  async getProfileById(profileId: number): Promise<ProfilePage> {
    const response = await axiosClient.get<ProfilePage>(`/profiles/${profileId}`);
    return response.data;
  },

  // 새 프로필 페이지 생성
  async createProfile(userId: string, profileData: { pagePath: string; designConcept?: string }): Promise<ProfilePage> {
    const response = await axiosClient.post<ProfilePage>('/profiles', {
      userId,
      ...profileData
    });
    return response.data;
  },

  // 프로필 페이지 업데이트
  async updateProfile(profileId: number, profileData: { pagePath?: string; designConcept?: string }): Promise<ProfilePage> {
    const response = await axiosClient.patch<ProfilePage>(`/profiles/${profileId}`, profileData);
    return response.data;
  },

  // 프로필 페이지 삭제
  async deleteProfile(profileId: number): Promise<void> {
    await axiosClient.delete(`/profiles/${profileId}`);
  },

  // 프로필 콘텐츠 추가
  async addProfileContent(
    profileId: number, 
    contentData: { contentType: 'IMAGE' | 'BIO_TEXT' | 'LINK'; contentValue: string; displayOrder: number }
  ): Promise<ProfileContent> {
    const response = await axiosClient.post<ProfileContent>(`/profiles/${profileId}/contents`, contentData);
    return response.data;
  },

  // 프로필 콘텐츠 업데이트
  async updateProfileContent(
    contentId: number,
    contentData: { contentType?: 'IMAGE' | 'BIO_TEXT' | 'LINK'; contentValue?: string; displayOrder?: number }
  ): Promise<ProfileContent> {
    const response = await axiosClient.patch<ProfileContent>(`/profiles/contents/${contentId}`, contentData);
    return response.data;
  },

  // 프로필 콘텐츠 삭제
  async deleteProfileContent(contentId: number): Promise<void> {
    await axiosClient.delete(`/profiles/contents/${contentId}`);
  },

  // 프로필 페이지 방문 기록
  async recordVisit(profileId: number): Promise<PageVisit> {
    const response = await axiosClient.post<PageVisit>(`/profiles/${profileId}/visit`);
    return response.data;
  },

  // 프로필 페이지 방문 통계 조회
  async getVisitStats(profileId: number, period: 'day' | 'week' | 'month' = 'week'): Promise<{ date: string; count: number }[]> {
    const response = await axiosClient.get<{ date: string; count: number }[]>(`/profiles/${profileId}/stats?period=${period}`);
    return response.data;
  },

  // 프로필 페이지 신고
  async reportProfile(profileId: number, reportData: { reportCategory: string; reportDetails?: string }): Promise<void> {
    await axiosClient.post(`/profiles/${profileId}/report`, reportData);
  },

  // 이미지 업로드
  async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosClient.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    
    return response.data.url;
  }
};

export default profileService;
