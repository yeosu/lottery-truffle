import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ThemeConfig } from '../types';
import { defaultThemes } from '../themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themes: ThemeConfig[];
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme은 ThemeProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes] = useState<ThemeConfig[]>(defaultThemes);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultThemes[0]);

  // 로컬 스토리지에서 테마 설정 불러오기
  useEffect(() => {
    const savedThemeId = localStorage.getItem('themeId');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    } else if (prefersDarkMode) {
      // 사용자 시스템이 다크 모드인 경우 다크 테마 적용
      const darkTheme = themes.find(theme => theme.isDark);
      if (darkTheme) {
        setCurrentTheme(darkTheme);
      }
    }
  }, [themes]);

  // 테마 변경 시 CSS 변수 업데이트
  useEffect(() => {
    const root = document.documentElement;
    
    // 색상 변수 설정
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // 기타 테마 변수 설정
    root.style.setProperty('--font-family', currentTheme.fontFamily);
    root.style.setProperty('--border-radius', currentTheme.borderRadius);
    root.style.setProperty('--box-shadow', currentTheme.boxShadow);
    
    // 다크/라이트 모드 클래스 설정
    if (currentTheme.isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // 로컬 스토리지에 테마 저장
    localStorage.setItem('themeId', currentTheme.id);
  }, [currentTheme]);

  // 테마 설정 함수
  const setTheme = (themeId: string) => {
    const newTheme = themes.find(theme => theme.id === themeId);
    if (newTheme) {
      setCurrentTheme(newTheme);
    }
  };

  // 다크/라이트 모드 전환 함수
  const toggleDarkMode = () => {
    const currentIsDark = currentTheme.isDark;
    const newTheme = themes.find(theme => 
      theme.isDark !== currentIsDark && 
      theme.name.includes(currentIsDark ? '라이트' : '다크')
    );
    
    if (newTheme) {
      setCurrentTheme(newTheme);
    } else {
      // 매칭되는 테마가 없으면 기본 다크/라이트 테마 사용
      const defaultTheme = themes.find(theme => theme.isDark !== currentIsDark);
      if (defaultTheme) {
        setCurrentTheme(defaultTheme);
      }
    }
  };

  const value = {
    currentTheme,
    themes,
    setTheme,
    toggleDarkMode
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
