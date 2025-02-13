import api from './api.ts'; // Axios 인스턴스 가져오기

// ✅ 사용자 정보 가져오기 API
export const getBoard = async () => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBoard = async (board) => {
  try {
    console.log('board', board);

    const response = await api.post('/todos', board);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBoard = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
