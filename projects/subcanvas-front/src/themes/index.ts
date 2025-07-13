import { ThemeConfig } from '../types';

// 밝은 테마 (기본)
export const lightTheme: ThemeConfig = {
  id: 'light',
  name: '밝은 테마',
  description: '깔끔하고 밝은 기본 테마입니다.',
  fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    background: '#ffffff',
    text: '#1e293b',
    accent: '#f59e0b',
    error: '#ef4444',
    warning: '#f97316',
    success: '#10b981'
  },
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  isDark: false
};

// 어두운 테마
export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: '어두운 테마',
  description: '눈의 피로를 줄이는 어두운 테마입니다.',
  fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
  colors: {
    primary: '#60a5fa',
    secondary: '#818cf8',
    background: '#0f172a',
    text: '#e2e8f0',
    accent: '#fbbf24',
    error: '#f87171',
    warning: '#fb923c',
    success: '#34d399'
  },
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
  isDark: true
};

// 사이버펑크 테마
export const cyberpunkTheme: ThemeConfig = {
  id: 'cyberpunk',
  name: '사이버펑크',
  description: '네온 불빛이 가득한 미래적인 디자인입니다.',
  fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
  colors: {
    primary: '#00ff41',
    secondary: '#ff00f5',
    background: '#0d0221',
    text: '#00ffff',
    accent: '#ff8a00',
    error: '#ff073a',
    warning: '#ffd300',
    success: '#39ff14'
  },
  borderRadius: '0',
  boxShadow: '0 0 10px #00ff41, 0 0 20px rgba(0, 255, 65, 0.5)',
  isDark: true
};

// 한국적인 테마
export const koreanTheme: ThemeConfig = {
  id: 'korean',
  name: '한국 전통',
  description: '한국적인 색상과 디자인이 적용된 테마입니다.',
  fontFamily: "'Noto Serif KR', serif",
  colors: {
    primary: '#a71e2e',
    secondary: '#1e67a7',
    background: '#f8f5f0',
    text: '#333333',
    accent: '#ffa845',
    error: '#c53030',
    warning: '#b4a30a',
    success: '#2d7745'
  },
  borderRadius: '0.25rem',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  isDark: false
};

// 중국풍 테마
export const chineseTheme: ThemeConfig = {
  id: 'chinese',
  name: '중국 전통',
  description: '중국 전통적인 색상과 분위기를 담은 테마입니다.',
  fontFamily: "'Ma Shan Zheng', 'Noto Sans SC', sans-serif",
  colors: {
    primary: '#c53030',
    secondary: '#ecc94b',
    background: '#fffbeb',
    text: '#622c0c',
    accent: '#d4af37',
    error: '#9b2c2c',
    warning: '#c05621',
    success: '#276749'
  },
  borderRadius: '0.25rem',
  boxShadow: '0 2px 4px rgba(98, 44, 12, 0.15)',
  isDark: false
};

// 일본풍 테마
export const japaneseTheme: ThemeConfig = {
  id: 'japanese',
  name: '일본 전통',
  description: '일본의 미니멀한 디자인과 색상을 적용한 테마입니다.',
  fontFamily: "'Noto Serif JP', serif",
  colors: {
    primary: '#d64545',
    secondary: '#426cb4',
    background: '#f9f4ef',
    text: '#2d3748',
    accent: '#f6ad55',
    error: '#e53e3e',
    warning: '#dd6b20',
    success: '#38a169'
  },
  borderRadius: '0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  isDark: false
};

// 크리스마스 테마
export const christmasTheme: ThemeConfig = {
  id: 'christmas',
  name: '크리스마스',
  description: '크리스마스의 따뜻하고 축제적인 분위기를 담은 테마입니다.',
  fontFamily: "'Mountains of Christmas', 'Noto Sans KR', cursive",
  colors: {
    primary: '#d72323',
    secondary: '#2d7638',
    background: '#f8f9fa',
    text: '#343a40',
    accent: '#d4af37',
    error: '#c92a2a',
    warning: '#e67700',
    success: '#2b8a3e'
  },
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
  isDark: false
};

// 미니멀리스트 테마
export const minimalistTheme: ThemeConfig = {
  id: 'minimalist',
  name: '미니멀리스트',
  description: '심플하고 깔끔한 디자인의 미니멀한 테마입니다.',
  fontFamily: "'IBM Plex Sans', sans-serif",
  colors: {
    primary: '#000000',
    secondary: '#666666',
    background: '#ffffff',
    text: '#333333',
    accent: '#999999',
    error: '#cf6679',
    warning: '#ffd54f',
    success: '#81c784'
  },
  borderRadius: '0.125rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  isDark: false
};

// 네오 레트로 테마
export const neoRetroTheme: ThemeConfig = {
  id: 'neoRetro',
  name: '네오 레트로',
  description: '80년대 레트로 분위기에 현대적 감각을 더한 테마입니다.',
  fontFamily: "'VT323', 'Press Start 2P', monospace",
  colors: {
    primary: '#ff6b6b',
    secondary: '#5ec9ff',
    background: '#17184b',
    text: '#f8f9fa',
    accent: '#ffeb3b',
    error: '#ff5252',
    warning: '#ffb74d',
    success: '#4caf50'
  },
  borderRadius: '0',
  boxShadow: '0 4px 0 #ff6b6b, 0 8px 12px rgba(0, 0, 0, 0.3)',
  isDark: true
};

// 북유럽 스타일 테마
export const nordicTheme: ThemeConfig = {
  id: 'nordic',
  name: '북유럽 스타일',
  description: '북유럽의 미니멀하고 차분한 디자인을 적용한 테마입니다.',
  fontFamily: "'Montserrat', sans-serif",
  colors: {
    primary: '#607d8b',
    secondary: '#78909c',
    background: '#f5f5f5',
    text: '#37474f',
    accent: '#ffab00',
    error: '#d32f2f',
    warning: '#ffa000',
    success: '#388e3c'
  },
  borderRadius: '0.25rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  isDark: false
};

// 전체 테마 모음
export const themes: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  cyberpunk: cyberpunkTheme,
  korean: koreanTheme,
  chinese: chineseTheme,
  japanese: japaneseTheme,
  christmas: christmasTheme,
  minimalist: minimalistTheme,
  neoRetro: neoRetroTheme,
  nordic: nordicTheme
};

// 기본 테마 배열 (ThemeContext에서 사용)
export const defaultThemes: ThemeConfig[] = [
  lightTheme,
  darkTheme,
  cyberpunkTheme,
  koreanTheme,
  chineseTheme,
  japaneseTheme,
  christmasTheme,
  minimalistTheme,
  neoRetroTheme,
  nordicTheme
];

export default themes;
