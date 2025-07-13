import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, AuthResponse } from '../types';
import userService from '../api/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 로컬 스토리지에서 토큰 확인 및 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await userService.login({ email, password });
      handleAuthSuccess(response);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 함수
  const register = async (email: string, password: string, nickname: string) => {
    setIsLoading(true);
    try {
      const response = await userService.register({ email, password, nickname });
      handleAuthSuccess(response);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 함수
  const socialLogin = async (provider: string, token: string) => {
    setIsLoading(true);
    try {
      const response = await userService.socialLogin(provider, token);
      handleAuthSuccess(response);
    } catch (error) {
      console.error('소셜 로그인 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/');
  };

  // 인증 성공 처리 함수
  const handleAuthSuccess = (response: AuthResponse) => {
    localStorage.setItem('accessToken', response.accessToken);
    setUser(response.user);
    navigate('/dashboard');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    socialLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
