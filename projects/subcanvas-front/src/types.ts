// 프로필 페이지 타입 정의
export interface ProfilePage {
  id: number;
  userId: number;
  pagePath: string;
  designConcept: string | null;
  createdAt: string;
  updatedAt: string;
  contents?: ProfileContent[];
  visits?: ProfileVisit[];
}

// 로그인 응답 타입
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// 프로필 컨텐츠 타입 정의
export interface ProfileContent {
  id: number;
  profileId: number;
  contentType: ContentType;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 컨텐츠 타입 열거형
export type ContentType = 'PHOTO' | 'LINK' | 'TEXT' | 'INTRO';

// 방문 기록 타입
export interface ProfileVisit {
  id: number;
  profileId: number;
  visitorIp?: string;
  visitedAt: string;
  referrer?: string;
}

// 유저 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// SNS 링크 타입
export interface SnsLink {
  id: number;
  profileId: number;
  platform: SnsPlatform;
  url: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// SNS 플랫폼 열거형
export type SnsPlatform = 
  'INSTAGRAM' | 
  'YOUTUBE' | 
  'FACEBOOK' | 
  'TWITTER' | 
  'LINKEDIN' | 
  'GITHUB' | 
  'BLOG' | 
  'TIKTOK' | 
  'OTHER';

// 사용자 레벨 및 관심도 타입
export interface UserLevel {
  id: number;
  userId: number;
  level: number;
  interestPoints: number;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
