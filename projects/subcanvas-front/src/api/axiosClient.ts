import axios from 'axios';

// 백엔드 API 기본 URL 설정
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
axiosClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    
    // 토큰이 있으면 요청 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러(인증 만료)이고 토큰 갱신 시도가 아직 안 됐을 때
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 여기에 토큰 갱신 로직 추가 가능
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        // localStorage.setItem('accessToken', response.data.accessToken);
        
        // 원래 요청 다시 시도
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
