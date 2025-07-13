export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  nickname: string;
  authProvider: 'LOCAL' | 'GOOGLE' | 'KAKAO';
  providerId?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'DORMANT' | 'BANNED';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  snsAccounts?: SnsAccount[];
  profilePages?: ProfilePage[];
}

export interface SnsAccount {
  id: number;
  userId: string;
  snsType: string;
  snsUrl: string;
  createdAt: string;
}

export interface ProfilePage {
  id: number;
  userId: string;
  pagePath: string;
  designConcept?: string;
  createdAt: string;
  updatedAt: string;
  contents?: ProfileContent[];
  visits?: PageVisit[];
}

export interface ProfileContent {
  id: number;
  profileId: number;
  contentType: 'IMAGE' | 'BIO_TEXT' | 'LINK';
  contentValue: string;
  displayOrder: number;
  createdAt: string;
}

export interface PageVisit {
  id: number;
  profileId: number;
  visitedAt: string;
  visitorIpHash?: string;
}

export interface AbuseReport {
  id: number;
  reportedProfileId: number;
  reporterUserId?: string;
  reportCategory: 'SPAM' | 'HATE_SPEECH' | 'PORNOGRAPHY' | 'OTHER';
  reportDetails?: string;
  status: 'PENDING' | 'REVIEWING' | 'RESOLVED';
  createdAt: string;
}

// 인증 관련 타입
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
}

export interface SocialLoginData {
  provider: 'GOOGLE' | 'KAKAO';
  token: string;
  email?: string;
  nickname?: string;
}

// 테마 관련 타입
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    error: string;
    warning: string;
    success: string;
  };
  borderRadius: string;
  boxShadow: string;
  isDark: boolean;
}
