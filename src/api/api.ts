import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:3000', // 기본 URL
  timeout: 5000, // 요청 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (요청 보내기 전에 실행)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 예제: 로컬스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 (응답 받았을 때 실행)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 오류 발생:', error);
    return Promise.reject(error);
  },
);

export default api;
