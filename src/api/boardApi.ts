import api from './api.ts'; // Axios 인스턴스 가져오기

// ✅ 사용자 정보 가져오기 API
export const getBoard = async () => {
  try {
    const response = await api.get(`/boards`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
