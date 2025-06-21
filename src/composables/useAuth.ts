import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

interface User {
  userId: number;
  username: string;
}

const token = ref(localStorage.getItem('token') || null);
const user = ref<User | null>(null);

// Set Axios default headers
if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await axios.get(`${API_URL}/profile`);
      user.value = response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If fetching user fails, token is likely invalid, so log out
      logout();
    }
  }

  async function login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const newToken = response.data.access_token;
      token.value = newToken;
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
      await fetchUser(); // Fetch user info after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function register(username, password) {
    try {
      await axios.post(`${API_URL}/register`, { username, password });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }

  // 토큰이 있을 때 자동으로 사용자 정보 가져오기
  const initializeAuth = async () => {
    if (token.value) {
      await fetchUser();
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    initializeAuth,
  };
} 